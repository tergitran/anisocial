import express from "express";
import postController from '../controllers/postController.js';
const router = express.Router();

router.get('/posts', postController.postList);
router.post('/post', postController.createNewPost);
router.delete('/post/:id', postController.deletePost);
router.post('/post/:id', postController.updateNewPost);

export default router;