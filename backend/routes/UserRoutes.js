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

const addNotification = async(userId,message)=>{
    try{
        await User.findByIdAndUpdate(
            userId,
            {$push:{notifications:{message}}},
            {new:true}
        );
    } catch(error){
        console.log(error);
    }
}

//Login

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Please enter a valid password" });
        }

        // Update the last login
        user.lastLogin = new Date();
        

        // Add a login notification and activity
        await addNotification(User._id, "User logged in successfully");
        await addActivity(user._id, "User logged in");
        await user.save();

        
        res.status(200).json({ message: "User login successful", user });
    } catch (error) {
        res.status(500).json({ message: "Error during login", error });
    }
});



// user profile route
router.get('/userprofile', authenticate, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }); // Find user by email
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({user});
    } catch (error) {
        res.status(500).json({ message: "Error fetching user profile", error });
    }
});

// Profile update route
router.put('/updateProfile', authenticate, async (req, res) => {
    const { profilePic, username } = req.body; // Destructure username and profilePic

    try {
        const updateFields = {};
        let message = ""; // Initialize a message variable

        if (profilePic) {
            updateFields.profilePic = profilePic; // Update profilePic field
        }
        if (username) {
            updateFields.username = username; // Update username field
        }

        const updatedUser = await User.findOneAndUpdate(
            { email: req.user.email },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Log specific notifications based on which fields were updated
        if (profilePic) {
            message = "Profile picture updated successfully";
            await addNotification(updatedUser._id, message);
            await addActivity(updatedUser._id, message);
            
        }
        if (username) {
            message = "Username updated successfully";
            await addNotification(updatedUser._id, message);
            await addActivity(updatedUser._id, message);
        }

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error });
    }
});



router.get('/getuser',authenticate, async (req,res)=>{
    try{
        const users = await User.findOne({email:req.user.email});
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


// Route to get all notifications for a user
router.get("/getnotifications", authenticate, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user.notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error });
    }
});

// route to return notification that not read
router.patch('/markAsRead', async (req, res) => {
    const { email, notificationId } = req.body;
    try {
        await User.updateOne(
            { email, "notifications._id": notificationId },
            { $set: { "notifications.$.isRead": true } }
        );
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark as read' });
    }
});






module.exports = router;