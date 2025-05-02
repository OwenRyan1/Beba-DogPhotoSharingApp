const fs = require('fs');
const { s3 } = require('../config/aws'); 
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3'); 

// helper functions for aws

function deleteFile(filePath) {
/*
params: 
filePath (str) - local filepath that stores the image

summary:
deletes the image from storage once stored successfully in database
*/
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            throw new Error(`Failed to delete file: ${err.message}`);
        }
    });
}

async function awsUploaded(filePath, profilePicture){
/*
params: 
filePath (str) - local filepath that stores the image
profilePicture (bool) - if its a profile picture or not

summary:
uploads file from local storage to cloud (S3)

returns: image url of where it is stored on aws
*/
  const fileContent = fs.readFileSync(filePath);
  const bucketName = process.env.bucketName;
  const awsRegion = process.env.AWS_REGION;

  //generate random file name
  const randomNum = Math.floor(Math.random() * 1000000);
  const date = new Date().toISOString(); 
  const fileName = `file-${randomNum}-${date}.jpg`;
  const bucketFolder = profilePicture ? 'profilePictures' : 'userUploads';

  const uploadParams = {
    Bucket: bucketName,
    Key: `${bucketFolder}/${fileName}`,
    Body: fileContent, 
    ContentType: 'image/jpeg', 
  };

  try {
    await s3.send(new PutObjectCommand(uploadParams));  // Upload the image
    console.log('Image uploaded successfully');
    const imageUrl = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${bucketFolder}/${fileName}`;

    return imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error.message);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

async function deleteImageAWS(filePathAWS){
/*
params: 
filePathAWS (str) - AWS url of image stored

summary:
deletes image from AWS - auth done on route this is just the helper to remove it from S3, can also do profiles pictures and will not delete the default
*/
  const bucketName = process.env.bucketName;
  const awsRegion = process.env.AWS_REGION;

  const filePath = filePathAWS.replace(`https://${bucketName}.s3.${awsRegion}.amazonaws.com/`, '');

  const deleteParams = {
    Bucket: bucketName,
    Key: filePath,
  };

  try {
    // Delete the object from S3 enless it is the default photo
    if (filePath != `profilePictures/defaultPhotoBeba.jpg`){
      await s3.send(new DeleteObjectCommand(deleteParams));
      console.log(`Image deleted successfully from AWS: ${filePath}`);
    }
    else{
      console.log('Skipping deletion, default profile picture');
    }

  } catch (error) {
    console.error('Error deleting image:', error.message);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

module.exports = {
    deleteFile,
    awsUploaded,
    deleteImageAWS
};