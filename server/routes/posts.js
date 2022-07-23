import express from 'express';
import {getMyPosts,commentPost,getPost,getPostsBySearch,createPost, getPosts ,updatePost, deletePost, likePost} from '../controllers/posts.js';
import auth from '../middleware/auth.js';


const router = express.Router();


router.get('/search',getPostsBySearch);
router.get('/myposts/:id',auth,getMyPosts);
router.get('/',getPosts);
router.get('/:id',getPost);
router.post('/',auth,createPost);
router.patch('/:id',auth ,updatePost);
router.delete('/:id',auth,deletePost);
router.patch('/:id/likePost',auth,likePost);
router.post('/:id/commentPost',auth,commentPost);

export default router;