import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { sendConnectionRequest, acceptConnectionRequest, rejectConnectionRequest, getConnectionRequests, getUserConnections, removeConnection, getConnectionStatus } from '../controllers/connection.controller.js';

const router = express.Router();

router.post('/request/:userId', protectRoute, sendConnectionRequest);
router.post('/accept/:requestId', protectRoute, acceptConnectionRequest);
router.post('/reject/:requestId', protectRoute, rejectConnectionRequest);

// Get all connections of a user
router.get('/requests', protectRoute, getConnectionRequests);

// Get all connections of a user
router.get('/', protectRoute, getUserConnections);
router.delete('/:userId', protectRoute, removeConnection);
router.get('/status:userId', protectRoute, getConnectionStatus);


export default router;