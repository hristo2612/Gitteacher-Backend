const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const secret = require("../config").secret;

let UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Can't be blank.."],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Can't be blank..."],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true
    },
    bio: String,
    image: String,
    hash: String,
    salt: String
  },
  { timestamps: true, usePushEach: true }
);

UserSchema.plugin(mongooseUniqueValidator, { message: "is already taken" });

// Hash the incoming password ( used for registration )
UserSchema.methods.hashPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

// Validate the incoming password ( used for login )
UserSchema.methods.validatePassword = function(password) {
  let incomingHash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === incomingHash;
};

// Generate a JWT
UserSchema.methods.generateToken = function() {
  let today = new Date();
  let exp = new Date(today); // Set expiration date
  exp.setDate(today.getDate() + 60); // 60 days from now

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000)
    },
    secret
  );
};

// Return logged in user profile
UserSchema.methods.authJSON = function() {
  return {
    username: this.username,
    email: this.email,
    token: this.generateToken(),
    bio: this.bio,
    image: this.image
  };
};

// Return a user profile
UserSchema.methods.profileJSON = function() {
  return {
    username: this.username,
    bio: this.bio,
    image: this.image
  };
};

mongoose.set("useCreateIndex", true);
mongoose.model("User", UserSchema);
