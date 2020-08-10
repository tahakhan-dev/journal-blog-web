const express = require('express');

const userDiaryController = require('../controllers/userdiary');
const userBlogController = require('../controllers/userblog');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/index',isAuth,userDiaryController.getUser);

router.post('/index',isAuth,userDiaryController.postUser);

router.get('/viewpost',isAuth,userDiaryController.getviewpost);

router.post('/viewpost',isAuth,userDiaryController.postviewpost);

router.get('/post-details/:postID',isAuth,userDiaryController.getProductDetails);

router.get('/compose',isAuth,userDiaryController.getCompose);

router.post('/compose',isAuth,userDiaryController.postCompose);

router.get('/post-edit/:postID',isAuth,userDiaryController.getPostEdit);

router.post('/post-edit',isAuth,userDiaryController.postEdit);

// or jo yeh "delte" route use keya hai woh is wajha se use keya hai ke hum client side pe kaam kr rahai the or waha pe delete route bhi hota hai

router.delete('/post/:postId',isAuth,userDiaryController.deletePost);

router.get('/vblog',isAuth,userBlogController.getviewblog);

router.post('/vblog',isAuth,userBlogController.postviewblog);

router.get('/blog-detail/:blogID',isAuth,userBlogController.getBlogDetail);

router.get('/cblog',isAuth,userBlogController.getcomposeblog);

router.post('/cblog',isAuth,userBlogController.postcomposeblog);

router.get('/blogdownload/:blogID',isAuth,userBlogController.getInvoice);



module.exports = router;
