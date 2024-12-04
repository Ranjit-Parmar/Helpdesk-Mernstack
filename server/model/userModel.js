import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter username"],
    unique: true,
    trim: true,
    minlength: [3, "Username should be at least 3 characters"],
    maxlength: [30, "Username should be at most 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    validate: {
      validator: (val) => validator.isEmail(val),
      message: "Please enter a valid email address",
    },
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "agent", "customer"],
    default: "customer",
  },
  passwordResetTokenExpire : Date,

  passwordResetToken : String,

  timestamp: {
    type: Date,
    default: Date.now,
  },
});


 // Encrypt password
 userSchema.pre("save", async function(next){
  if(!this.isModified("password")){
      return next();
  }else{
      // password encryption
     this.password = await bcrypt.hash(this.password, 12);
     next();
  }
})

// Decrypt password
userSchema.methods.comparePassword = function(userInputPassword){
  return bcrypt.compare(userInputPassword, this.password);
}


// Generate Password Reset Token
userSchema.methods.generatePasswordResetToken = async function(){
  
  // generate hex token
 const data = crypto.randomBytes(20).toString('hex');
 const token = crypto.createHash('sha256').update(data).digest('hex');

 this.passwordResetTokenExpire = Date.now() + 2 * 60 * 1000;
 this.passwordResetToken = token;
 return data;
}

const User = mongoose.model("User", userSchema);

export default User;
