const router = require('express').Router();
const User = require('../models/User');
const bcryptjs = require('bcryptjs');


//Registeration of users
router.post('/register', async(req, res) => {
    try {
        let { username, email, password } =req.body;

        if (!username || !email || !password)
        return res.status(400).json({success: false, msg: 'All fields are required'});

        let newUsername = username.toLowerCase().replace(/ /g, '');

        const user_name = await User.findOne({username: newUsername});
        if(user_name) return res.status(400).json({success: false, msg: 'Username already exists'});

        const user_email = await User.findOne({email});
        if(user_email) return res.status(400).json({success: false, msg: 'Email already exists'});

        let hashedPassword = bcryptjs.hashSync(password, 12);

        const newUser = new User({
            username: newUsername,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        if(!newUser) return res.status(500).json({success: false, msg: 'An error has occurred'});

        res.status(200).json({
            success: true,
            msg: 'User saved successfully',
            user: newUser
        });
    } catch (err) {
        res.status(500).json({msg: err.message});
    }
})

//Login of users
router.post('/login', async (req, res) => {
    try {
        let { userInput, password } = req.body;

        if(!userInput || !password) return res.status(400).json({success: false, msg: 'All fields are required'});

        let findUser = await User.findOne({
            $or: [
                { username: userInput },
                { email: userInput }
            ]
        });

        if(!findUser) return res.status(400).json({success: false, msg: 'Wrong Crendentials'});

        let passwordMatch = await bcryptjs.compare(password, findUser.password);

        if(!passwordMatch) return res.status(403).json({success: false, msg: 'Invalid login Credentials'});

        res.status(200).json({
            success: true,
            msg: 'Login successful',
            user: {
                ...findUser._doc,
                password: ''
            }
        });
        
    } catch (err) {
        res.status(500).json({success: false, msg: err.message});
    }
})


module.exports = router;