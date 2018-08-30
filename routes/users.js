const router = require('express').Router();
const mongoose = require('mongoose');
const passport = require('passport');

const auth = require('./auth');
let User = mongoose.model('User');

router.get('/', (req, res) => {
    res.send('Get user muser');
});

module.exports = router;