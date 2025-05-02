require('dotenv').config();
const express = require('express');
const dbConnect = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");

//routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const dailyTopicRoutes = require('./routes/dailyTopic');
const dogBreeds = require('./routes/dogBreeds');

const app = express();
const PORT = 3000;

//allowing front end items (maybe make function in future if there is a lot idk)
app.use(express.json()); 
app.use('/uploads', express.static('uploads'));

// database connection
dbConnect();

// activate api's needed
app.use('/api/users', userRoutes); 
app.use('/api/users', dogBreeds); 
app.use('/api/prompt', dailyTopicRoutes); 
app.use('/api/auth', authRoutes); 

//error middleware
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
