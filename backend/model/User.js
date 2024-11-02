const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePicture: {
        type: String
    },
    
    lastLogin: {
        type: Date
    },
    activities: [
        {
            message: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    theme: {
        type: String,
        default: "light"
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

userSchema.methods.updateLastLogin = function() {
    this.lastLogin = Date.now();
    return this.save();
};

module.exports = mongoose.model("User", userSchema);
