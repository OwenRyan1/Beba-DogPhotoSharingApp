const express = require('express');
const User = require('../models/user'); 
const router = express.Router();
const multer = require('multer'); //image uploading
const upload = multer({ dest: 'uploads/' });
const { deleteFile, awsUploaded, deleteImageAWS } = require('../utils/imageHelper');
const authToken = require('../middleware/authToken');

/**
 * @route GET /api/users/findUser/:username
 * @description Fetch a user's profile via username and display information
 * @param {string} username - The unique username of the user.
 * @returns {Object} 200 - The user's profile information.
 * @returns {Object} 404 - User not found.
 * @returns {Object} 500 - Server error.
 */
router.get('/findUser/:username', authToken, async (req, res) => {
    try {
        const { username } = req.params;  
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            username: user.username,
            dogType: user.dogType,
            dogName: user.dogName,
            images: user.images,
            profilePicture: user.profilePicture,
            createdAt: user.createdAt
        });

    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

/**
 * @route POST /api/users/imageUpload
 * @description Uploads an image for a specific user, saves file temp and calls awsUploaded to save image on cloud
 *              Then saves file url on DB. Also can update a profile picture
 *              and overwrite the previous photo. Removes old profile pic from AWS as well
 * @param {file} image - The image file to upload (from form-data).
 * @returns {Object} 200 - A success message because file is uploaded to users account and AWS
 * @returns {Object} 400 - If no file is uploaded or invalid user
 * @returns {Object} 500 - If an error occurs during the upload process either in aws or locally 
 */
router.post('/imageUpload', authToken, upload.single('image'), async (req, res) => {
    let imagePath = '';
    let profilePictureBool = false; 
    try {
        const user = req.user; 
        imagePath = `uploads/${req.file.filename}`;
        const oldProfilePicture = user.profilePicture

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        //check if uploading new profile picture or general photo
        if (req.body.profilePicture) {
            profilePictureBool = true; 
        }
        
        //save to aws
        const awsImagePath = await awsUploaded(imagePath, profilePictureBool);

        //save url to database
        if (profilePictureBool){
            user.profilePicture = awsImagePath;
        }
        else{
            user.images.push({
                path: awsImagePath,
                postedAt: new Date()
            });
        }
        await user.save({ validateBeforeSave: false }); // Disable validation on username aspect (REQUIRED)

        if (req.file) {
            deleteFile(imagePath);
        }

        //deleting old profile picture
        if (profilePictureBool){
            deleteImageAWS(oldProfilePicture);
        }

        res.status(200).json({ message: 'Image uploaded successfully'});
    } catch (error) {
        res.status(500).json({ error: "Failed to upload image", details: error.message });
        if (req.file) {
            deleteFile(imagePath);
        }
    }
});

/**
 * @route POST /api/users/deleteImage
 * @description removes image from S3 and also the database. This is only called on imageUploads folder as profile pics are deleted from S3 when new one is added
 * @param {file} image
 * @returns {Object} 200 - A success message because file is deleted
 * @returns {Object} 403 - if someone is trying to delete a URL not within their images saved
 * @returns {Object} 500 - If an error occurs during the delete process either in aws or locally 
 */
router.delete('/deleteImage', authToken, upload.single('image'), async (req, res) => {
    try {
        const user = req.user; 
        const imagePath = req.body.imagePath;
        
        // Verify that the image exists in the user's images array
        const imageExists = user.images.some(image => image.path === imagePath);
        if (!imageExists) {
            return res.status(403).json({ error: 'You are not authorized to delete this image.' });
        }

        //delete on aws
        await deleteImageAWS(imagePath);

        //remove from database once deleted
        await User.updateOne(
            { _id: user._id }, 
            { $pull: { images: { path: imagePath } } }
        );
        
        res.status(200).json({ message: 'Image deleted successfully from AWS and DB'});
    } catch (error) {
        res.status(500).json({ error: "Failed to delete image", details: error.message });
    }
});

/**
 * @route GET /api/users/createFeed
 * @description Retrieves the latest {limit} images posted by ALL users for the feed. Each image is linked to the respective user's username, 
 *              and only the image URL and timestamp are returned.
 * @returns {Object} 200 - A success message with an array of image objects containing the username, image URL, and timestamp.
 * @returns {Object} 500 - If an error occurs during the retrieval of the images.
 */
router.get('/createFeed', authToken, async (req, res) => {
    try {
        const limit = 50;
        const latestImages = await User.aggregate([
            { $unwind: "$images" }, // makes image url and postedAt come separate 
            { $sort: { "images.postedAt": -1 } },
            { $limit: limit },
            {
              $project: {
                _id: 0, // exclude id
                username: 1, // include username 
                "imageUrl": "$images.path", 
                "postedAt": "$images.postedAt" 
              }
            }
          ]);
        res.json(latestImages);
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

module.exports = router;
