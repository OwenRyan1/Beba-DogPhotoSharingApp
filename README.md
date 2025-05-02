# 🎵 Beba - A Dog Photo Sharing Platform

BETA - this is still under active development and is used to show my coding work. But all in all could one day be a fun sharing platform 
- Only the backend is underway for development (front end to come next)

## 📚 Table of Contents

- [🎵 Beba - A Dog Photo Sharing Platform](#-beba---a-dog-photo-sharing-platform)
- [✨ App Idea](#-app-idea)
- [🚀 Features](#-features)
- [📦 Requirements](#-requirements)
- [🔧 Setup Instructions](#-setup-instructions)
- [💡 Roadmap of Folder/Directory Structure](#-roadmap-of-folder/directory-structure)
- [🏃‍♂️ Starting and Stopping the Application](#-starting-and-stopping-the-application)
- [🛠 Tech Stack](#-tech-stack)
- [🔧 Installation](#-installation)
- [🎯 Future](#-future)

## ✨ App Idea 
Users can create an account that resolves around their dog. Each day a daily prompt is given that will coincide with a picture idea to take of their dog. Inspiration came from BeReal, just adding a topic for each day and on the basis of animals

## 🚀 Features

- Create an account with information on their dog. See `server/src/models/user.js` for model details.
- Find other users and see their account
- Upload and delete images, that our stored on AWS S3.
- Scroll through a Feed that shows other users accounts posts, in BETA (no public/private account methodology)

## 📦 Requirements

1. Set up an AWS S3 account.
2. Set up MongoDB with Mongoose.
    - download MongoDB Compass for ease of use
3. Get an API key from [The Dog API](https://www.thedogapi.com/).
4. Install dependencies: [Installation](#installation).

## 🔧 Setup Instructions    

1. **Clone this repository**

   ```bash
   git clone git@github.com:OwenRyan1/Beba-DogPhotoSharingApp.git
   cd Beba-DogPhotoSharingApp
   ```

2. Go through [Requirements](#Requirements) section

3. **Set up the repository**
    1. Create a .env file and add 
   ```bash
    #database
    MONGO_URI = ""

    #web token
    JWT_SECRET = ""

    #dog api site 
    DOG_API_KEY = ""

    #aws credentials and info 
    AWS_ACCESS_KEY_ID = ""
    AWS_SECRET_ACCESS_KEY = ""
    AWS_REGION = ""
    bucketName = ""
    ```

    2. [Install Tech Stack Dependencies](#installation)

## 💡 Roadmap of Folder/Directory Structure

**server.js**  - main starting point

1. config
    - connecting to databases (mongoose + MongoDB and AWS S3)

2. data
    - ai generated json data of daily topics (simple static list for testing purposes)

3. middleware
    - contains functionality for authentication and error handling. It verifies JWT tokens for protected routes and handles errors, including Mongoose validation issues and server errors.

4. Models
    - defines the models for database and attributes that go along with each users account

5. Routes
    - all APIs for user needs including but not limited to: register, login, fetching breeds, daily topic grab, user searching, and image upload

6. utils
    - small functions to help throughout the backend 


## 🏃‍♂️ Starting and Stopping the Application

- To run the backend, use the following commands:

    **1. Start database**
    ```bash
    brew services start mongodb-community@6.0
    ```

    **Ensure database started**
    ```bash
    brew services list
    ```

    **Close database**
    ```bash
    brew services stop mongodb-community@6.0
    ```

    **2. Start main**
    ```bash
    npm run dev
    ```

## 🛠 Tech Stack

To run this project, you'll need the following:

- **Node.js**: JavaScript runtime for both front-end and back-end.
- **Express.js**: Web framework for building the server.
- **MongoDB**: NoSQL database for storing user data and images.
- **Mongoose**: ODM for interacting with MongoDB.
- **JWT (JSON Web Token)**: Used for authentication and securing API routes.
- **AWS S3**: Used for storing images and files.
- **Nodemon**: Utility for automatically restarting the server during development.
- **dotenv**: Loads environment variables from a `.env` file.

## 🔧 Installation

- Install the required dependencies by running the following command:

    ```bash
    npm install express mongoose jsonwebtoken dotenv aws-sdk multer nodemon
    ```

    Also if on Mac - can utilize this to set up the database
    ```bash
    brew tap mongodb/brew
    brew install mongodb-community@6.0
    ```

## 🎯 Future 
1. Vercel 
    - hosting website 
2. MongoDB Atlas
    - putting DB on cloud
3. Tests directory
    - for unit tests
4. A functional front end to support the backend functionality 