const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require("validator");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");


const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    // validate: [validator.isEmail, "please provide a correct email"],
    required: [true, "A user must have a email"],
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 15,
    required: [true, "A user must have a password"],
  },
  confirmPassword: {
    type: String,

    minlength: 6,
    maxlength: 15,
    required: [true, "A user must have a password"],
  },
  country: {
    type: String,
    default: "India",
  },
  role: {
    type: String,
    default: "user",
  },
  status: {
    type: String,
    enum: ["Pending", "Active"],
    default: "Pending",
  },
  confirmationCode: {
    type: String,
    // unique: true,
  },
  forgotPasswordToken: String,
  forgotPasswordExpary: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function(next) {
    // if before password is not modified before save
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comperePassword = async function (mypassword,cb) {
     bcrypt.compare(mypassword,this.password,(err, isMatched)=>{
       if (err) return cb(err);
       else {
         cb(null, isMatched);
         return;
       }
     });
}

UserSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRECT,{
        expiresIn: '1800s'
    });
}

UserSchema.methods.createForgotPasswordToken = function () {
  let token = uuidv4(); 
  token = token.replace(/\b-\b/g,'');
  this.forgotPasswordToken = token;
  this.forgotPasswordExpary = Date.now() + 100 * 60 * 1000;
  
  return token;
}
module.exports = mongoose.model("User", UserSchema);
