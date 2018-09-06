const router = require('express').Router();
const mongoose = require('mongoose');
const passport = require('passport');
const auth = require('./auth');
let User = mongoose.model('User');

router.get('/', (req, res) => {
    res.send('Get user muser');
});

router.post('/register', (req, res, next) => {
    let user = new User();

    // Set username and email to newly created User model
    user.username = req.body.user.username;
    user.email = req.body.user.email;

    // Hash the pass
    user.hashPassword(req.body.user.password);

    // Save the user
    user.save().then(() => {
        return res.json({ user: user.authJSON() });
    }).catch(next);
});

router.post('/login', (req, res, next) => {
    if (!req.body.user.email) {
        return res.status(422).json({ errors: { email: "can't be blank" } });
    }

    if (!req.body.user.password) {
        return res.status(422).json({ errors: { password: "can't be blank" } });
    }

    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) { return next(err) }

        if (user) {
            user.token = user.generateToken();
            return res.json({ user: user.authJSON() });
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
});

router.get('/user', auth.required, (req, res, next) => {
    User.findById(req.payload.id).then((user) => {
        if (!user) {
            res.sendStatus(401);
        }
        return res.json({ user: user.authJSON() });
    }).catch(next);
});

router.put('/user', auth.required, (req, res, next) => {
    User.findById(req.payload.id).then((user) => {
        if (!user) {
            res.sendStatus(401);
        }

        if (typeof req.body.user.username !== 'undefined') {
            user.username = req.body.user.username;
        }

        if (typeof req.body.user.email !== 'undefined') {
            user.email = req.body.user.email;
        }

        if (typeof req.body.user.bio !== 'undefined') {
            user.bio = req.body.user.bio;
        }

        if (typeof req.body.user.image !== 'undefined') {
            user.image = req.body.user.image;
        }

        if (typeof req.body.user.password !== 'undefined') {
            user.hashPassword(req.body.user.password);
        }

        return user.save().then(() => {
            return res.json({ user: user.authJSON() });
        });
    }).catch(next);
});

module.exports = router;