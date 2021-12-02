const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const bcryptjs = require('bcryptjs');



//UPDATE
router.put('/:id', async(req, res) => {
    if(req.body.userId === req.params.id) {
        if(req.body.password) {
            req.body.password = await bcryptjs.hashSync(req.body.password, 12);
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, {new: true});
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json({msg: err.message});
        }
    } else {
        res.status(401).json({success: false, msg: 'You can update only your account!'});
    }
})

//DELETE
router.delete('/:id', async(req, res) => {
    if(req.body.userId === req.params.id) {

        try {
            const user = await User.findById(req.params.id)
            try {
                await Post.deleteMany({ username: user.username });
                await User.findByIdAndDelete(req.params.id)
                res.status(200).json({sucess: true, msg: 'User has been deleted successfully'});
            } catch (err) {
                res.status(500).json({msg: err.message});
            }
        } catch (err) {
            res.status(404).json({success: false, msg: 'User not found!'});
        }

    } else {
        res.status(401).json({success: false, msg: 'You can delete only your account!'});
    }
})

//Getting Users
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json({success: false, msg: 'User does not exist!'});
    }
})


module.exports = router;