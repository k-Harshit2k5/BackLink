import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getUserNotifications, markNotificationAsRead, deleteNotification, deleteAllNotifications } from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/', protectRoute, getUserNotifications);

router.put('/:id/read', protectRoute, markNotificationAsRead);
router.delete('/:id', protectRoute, deleteNotification);
router.delete('/', protectRoute, deleteAllNotifications);


export default router;