const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// model for user to go into database 
const userSchema = new Schema({

  username: { type: String, 
    required: [true, "Username is required!"],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot be longer than 30 characters'],
    validate: [ 

      //ensure username doesn't exist
      {
        validator: async function (value) {
          const existingUser = await mongoose.model('User').findOne({ username: value });
          return !existingUser;
        },
        message: "Username or email already exists, try new information."
      },
    ] 
  },

  email: { type: String, 
    required: [true, "Email is required!"],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [320, "Email cannot exceed 320 characters."],
    validate: 
    [

      //ensure email doesn't exist
      {
        validator: async function (value) {
          const existingUser = await mongoose.model('User').findOne({ email: value });
          return !existingUser;
        },
        message: 'Username or email already exists, try new information.'
      },

      // ensure email follows correct patter
      {
        validator: function(value){
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: "Email validation failed because it must be in the format: username@domain.extension"
      }
    ]  
  },

  password: { type: String,
     required: [true, "Password is required!"],
  },

  dogName: { type: String, 
    required: [true, "Dog name is required!"],
    trim: true,
    minlength: [2, 'Dog name must be at least 2 characters long'],
    maxlength: [30, 'Dog name cannot be longer than 30 characters'],
  },

  dogType: { type: String, 
    required: [true, "Dog Type is required!"],
    trim: true 
  },

  images: [
    {
      path: { type: String},
      postedAt: { type: Date,
        default: Date.now,
        immutable: true //for image updating (futuristic) need to change this
      } 
    }
  ],

  profilePicture: {type: String,
    default: 'https://beba.s3.us-east-1.amazonaws.com/profilePictures/defaultPhotoBeba.jpg' // basic username until set
  },
  
  updatedAt: {type: Date},

  createdAt: {type: Date,
    default: Date.now,
    immutable: true
  }
});

// keep track whenever user account is updated
userSchema.pre("save", function (next){
  this.updatedAt = Date.now();
  next()
});

// after save show success
userSchema.post("save", function (doc, next){
  console.log("Saved Profile Changes!")
  next()
});

const User = mongoose.model('User', userSchema);
userSchema.path('images').schema.set('_id', false);

module.exports = User;