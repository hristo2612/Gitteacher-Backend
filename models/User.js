const mongoose = require('mongoose')
const mongooseUniqueValidator = require('mongoose-unique-validator')
const crypto = require('crypto')
const jsonwebtoken = require('jsonwebtoken')

const secret = require('../config').secret;

let UserSchema = new mongoose.Schema({
    
});

mongoose.model('User', UserSchema);