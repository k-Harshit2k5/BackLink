import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const signup = async(req, res) => {
    try {
        const { name, username, email, password, dateOfBirth } = req.body;
        const existingUser = await User.findOne({ email });
        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        } 
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            username,
            email,
            dateOfBirth: new Date(dateOfBirth),
            password: hashedPassword
        });

        await newUser.save();  
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
        res.cookie('jwt-backlink', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 3 * 24 * 60 * 60 * 1000 });
        res.status(201).json({ message: 'User created successfully', user: { id: newUser._id, name: newUser.name, username: newUser.username, email: newUser.email }, token });
    

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' }); 
    
    }
}

export const login = async(req, res) => {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });    
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
        res.cookie('jwt-backlink', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 3 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ message: 'Login successful', user: { id: user._id, name: user.name, username: user.username, email: user.email } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' }); 
    }
}

export const logout = async(req, res) => {
    try {
        res.clearCookie('jwt-backlink');
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' }); 
    }
}

export const getCurrentUser = async(req, res) => {
    try {
        const user = req.user; // The user is already populated by the protectRoute middleware
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user: { id: user._id, name: user.name, username: user.username, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' }); 
    }
}