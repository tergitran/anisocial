import express from "express";
import userController from '../controllers/userController.js';
const router = express.Router();

router.get('/', userController.getFriends);
router.post('/sent', userController.sentFriendRequest);
router.post('/cancel', userController.cancelFriendRequest);
router.post('/accept', userController.acceptFriendRequest);
router.post('/decline', userController.declineFriendRequest);
router.post('/unfriend', userController.unfriend);

export default router;