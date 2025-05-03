import User from '../models/user.model.js';
import cloudinary from '../lib/cloudinary.js';
export const getSuggestedConnections = async (req, res) => { 
    try {
        const currentUser = await User.findById(req.user._id).select('connections'); 
        //find users that are already connected to the current user
        const alreadyConnected = currentUser.connections;
        //find users that are not connected to the current user
        const notConnected = await User.find({_id: { $nin: alreadyConnected, $ne: req.user._id }}).select('name email profilePicture headline').limit(5);
        res.json(notConnected);

    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'error',message: error.message});
    }
 }  

 export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('-password');
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: error.message });
    }
 }
 export const updateProfile = async (req, res) => {
    try {
        const allowedFields = ['name', 'profilePicture', 'bannerPicture', 'location', 'headline', 'bio', 'skills', 'experience', 'education', 'projects','connections'];
        
        const updatedData = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updatedData[field] = req.body[field];
            }
        }

        if(req.body.profilePicture) {
            const result = await cloudinary.uploader.upload(req.body.profilePicture);
            updatedData.profilePicture = result.secure_url;
        }
        if(req.body.bannerPicture) {
            const result = await cloudinary.uploader.upload(req.body.bannerPicture);
            updatedData.bannerPicture = result.secure_url;
        }

        const user = await User.findByIdAndUpdate(req.user._id, {$set:updatedData}, { new: true }).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: error.message });
    }
    
 }
 
