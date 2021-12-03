const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');



//CREATE POST
router.post('/', async(req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json({success: true, msg: 'Post created successfully', savedPost});
    } catch (err) {
        res.status(500).json({success: false, msg: 'An error occurred while creating the post'});
    }
})

//UPDATE POST
router.put('/:id', async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.username === req.body.username) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                }, {new: true})
                res.status(200).json({success: true, msg: 'Post updated successfully', updatedPost});
            } catch (err) {
                res.status(500).json({success: false, msg: 'An error occurred while updating the post'})
            }
        } else {
            res.status(401).json({success: false, msg: 'You can update only your post'})
        }
    } catch (err) {
        res.status(500).json({success: false, msg: 'An error occurred while trying to find post'});
    }
})

//DELETE POST
router.delete('/:id', async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.username === req.body.username) {
            try {
                await post.delete();
                res.status(200).json({success: true, msg: 'Post deleted successfully'});
            } catch (err) {
                res.status(500).json({success: false, msg: 'An error occurred while deleting the post'})
            }
        } else {
            res.status(401).json({success: false, msg: 'You can delete only your post'})
        }
    } catch (err) {
        res.status(500).json({success: false, msg: 'An error occurred while trying to find post'});
    }
})

//GET POST
router.get('/:id', async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({success: false, msg: 'An error occurred while trying to fetch post'});
    }
})

//GET ALL POST
router.get('/', async(req, res) => {
    const username = req.query.user;
    const catName = req.query.cat;
    try {
        if(username) {
            posts = await Post.find({username});
        } else if(catName) {
            posts = await Post.find({categories: {
                $in:[catName]
            }})
        } else {
            posts = await Post.find();
        }
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({success: false, msg: 'An error occurred while trying to fetch post'});
    }
})


module.exports = router;