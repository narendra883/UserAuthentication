const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const userRoutes = require("./routes/UserRoutes");

require('dotenv').config();


const app = express();

const allowedOrigins = [
    'https://user-dashboard-nine.vercel.app', // Production
    'http://localhost:5173' // Development
];

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use(bodyParser.json());
const port = process.env.PORT || 3000;

// Connect to MongoDB
const dbUrl = process.env.DB_URI; 
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));


app.get('/', (req, res) => {
    res.send('Hello, Express with MongoDB!');
});

app.use('/api/users', userRoutes);



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});