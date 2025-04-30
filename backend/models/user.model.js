import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true, 
        trim : true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    profilePicture: {
        type: String,
        default: "https://example.com/default-profile-picture.png",
    },
    bannerPicture: {
        type: String,
        default: "https://example.com/default-banner-picture.png",
    },
    location: {
        type: String,
        default: "Earth",
    },
    headline: {
        type: String,
        default: "LinkBack User",
    },
    bio: {
        type: String,
        default: "new user",
    },
    skills: {
        type: [String],
        default: [],
    },
    experience: {
        type: [{
            title: { type: String, required: true },
            company: { type: String, required: true },
            location: { type: String, required: true },
            startDate: { type: Date, required: true },
            endDate: { type: Date, required: true },
            description: { type: String, required: true },
        }],
        default: [],
    },
    education: {
        type: [{
            school: { type: String, required: true },
            degree: { type: String, required: true },
            fieldOfStudy: { type: String, required: true },
            startDate: { type: Date, required: true },
            endDate: { type: Date, required: true },
        }],
        default: [],
    },
    projects: {
        type: [{
            title: { type: String, required: true },
            description: { type: String, required: true },
            link: { type: String, required: true },
        }],
        default: [],
    },
    connections: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },
},{timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;