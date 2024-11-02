const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const authenticate = require("../middleware/AuthMiddleware");
const User = require("../model/User");
const router = express.Router();


//Registration
router.post('/register',async(req,res)=>{
    const {username,email,password} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({username, email,password:hashedPassword});
        await newUser.save();

        res.status(201).json({message:"User Registered Successfully"});
    } catch(error){
        res.status(500).json({message:"Error while registering user",error});
    }
});

const addActivity = async(userId,message)=>{
    try{
        await User.findByIdAndUpdate(
            userId,
            {$push:{activities:{message}}},
            {new:true}
        );
    } catch(error){
        console.log(error);
    }
}

//Login

router.post('/login',async(req,res)=>{
    const {email,password} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User Not Found    "});
        }
        const passwordMatch = await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            return res.status(401).json({message:"please enter valid password"});
        }

        // update the last login
        user.lastLogin = new Date();
        await user.save();

        // Log login activity
        await addActivity(user._id,"User Logged in");
        res.status(200).json({message:"User Login successful",user});

    } catch(error){
        res.status(500).json({message:"Error:",error});
    }
});


// user profile route
router.get('/userprofile', authenticate, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }); // Find user by email
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            lastLogin: user.lastLogin,
            theme: user.theme,
            twoFactorEnabled: user.twoFactorEnabled
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user profile", error });
    }
});

// Profile update route
router.put('/updateProfile', authenticate, async (req, res) => {
    const { profilePic } = req.body;

    try {
        // Find and update the user’s profile picture
        const updatedUser = await User.findOneAndUpdate(
            { email: req.user.email },
            { profilePic },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Add activity for profile update
        await addActivity(updatedUser._id, "User updated profile picture");

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error });
    }
});


router.get('/getallusers', async (req,res)=>{
    try{
        const users = await User.find({});
        res.status(200).json(users);
    } catch(error){
        res.status(500).json({message:"Error while fetching the users"});
    }
});

// Route to fetch activities for a specific user
router.get('/activities/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).select('activities');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.activities);
    } catch (error) {
        res.status(500).json({ message: "Error fetching activities", error });
    }
});



module.exports = router;