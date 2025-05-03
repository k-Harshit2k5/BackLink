import Notification from "../models/notification.model.js";

export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recepient: req.user._id }).sort({ createdAt: -1 })
        .populate('relatedUser', 'name profilePicture username')
        .populate('relatedPost', 'content image')

        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate({_id:req.params.id, recepient: req.user._id},{ isRead: true }, { new: true });
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.status(200).json(notification);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete({_id:req.params.id, recepient: req.user._id});
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ recepient: req.user._id });
        res.status(200).json({ message: "All notifications deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

