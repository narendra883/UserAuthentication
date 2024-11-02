const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const userRoutes = require("./routes/UserRoutes");

require('dotenv').config();


const app = express();
app.use(cors({ origin: 'https://user-dashboard-nine.vercel.app' }));

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