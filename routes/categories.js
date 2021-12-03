const router = require('express').Router();
const Category = require('../models/Category');

//CREATE CATEGORY
router.post('/', async (req, res) => {
    const newCat = new Category(req.body);
    try {
        const savedCat = await newCat.save();
        res.status(200).json({success: true, msg: 'Here is your Category', savedCat})
    } catch (err) {
        res.status(500).json({success: false, msg: 'Something went wrong'})
    }
})

//GET ALL CATEGORY
router.get('/', async (req, res) => {
    try {
        const cats = await Category.find();
        if(cats !== null) {
            res.status(200).json({success: true, msg: 'Here is all Categories', cats})
        } else {
            res.status(200).json({success: false, msg: 'No Category found!'})
        }
        
    } catch (err) {
        res.status(500).json({success: false, msg: 'Something went wrong while fetching all categories'})
    }
})



module.exports = router;