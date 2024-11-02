const User = require("../model/User");
const bcrypt = require("bcryptjs")

const authenticate = async (req, res, next) => {
    const email = req.headers['x-user-email']; // Use a custom header for the email

    if (!email) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user; // Set the user in the request object
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};

module.exports = authenticate;