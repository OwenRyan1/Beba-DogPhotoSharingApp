const express = require('express');
const bcrypt = require('bcryptjs');  //hashing passwords
const User = require('../models/user'); 
const router = express.Router();
const jwt = require('jsonwebtoken'); //access token

/**
 * @route POST /api/auth/register
 * @description Registers a new user, all validation besides password done in user.js on the schema
 * @param {string} username - The username chosen by the user.
 * @param {string} email - The email address provided by the user.
 * @param {string} password - The user's password (will be hashed).
 * @param {string} dogType - The type of dog the user owns.
 * @param {string} dogName - The name of the user's dog.
 * @returns {Object} 201 - A success message when the user is successfully registered.
 * @returns {Object} 400 - Users password failed validation - gives requirements
 */
router.post('/register', async (req, res, next) => {
  const { username, email, password, dogType, dogName, dogAge } = req.body;

  try {
    // password requirements done on front end as well but last check here
    const regex = /^(?=(.*\d.*))(?=(.*[a-z].*))(?=(.*[A-Z].*))(?=(.*[!@#$%^&*].*))[\w!@#$%^&*]{8,}$/; // uppercase, lowercase, special char, 8 len, num
    if (!regex.test(password)) {
      return res.status(400).json({ message: "Password must contain a number, an uppercase letter, lowercase letter, special character, and be 8 characters long" });
    }

    // create new user in database 
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      dogName,
      dogType
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      next(error);
  }
});

/**
 * @route POST /api/auth/login
 * @description Logs in a user by validating their email and password, then generates and returns a JWT token that will be used on any proceeding calls
 * thus ensuring validation
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password to be validated.
 * @returns {Object} 200 - A success message with the JWT token if login is successful.
 * @returns {Object} 400 - If the email or password is incorrect.
 * @returns {Object} 500 - If there is a server error during login.
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try{
    const existingUser = await User.findOne({ email });

    // ensure valid email 
    if (!existingUser){
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // check if passwords matches
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // send token for user to have to utilize other APIs
    const token = jwt.sign(
      { userId: existingUser._id, username: existingUser.username },
      process.env.JWT_SECRET, 
      { expiresIn: '7d' } 
    );

    //send token along with profile information 
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        username: existingUser.username,
        email: existingUser.email,
        dogType: existingUser.dogType,
        dogName: existingUser.dogName,
        profilePicture: existingUser.profilePicture, 
        images: existingUser.images,
        createdAt: existingUser.createdAt
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
})

module.exports = router;