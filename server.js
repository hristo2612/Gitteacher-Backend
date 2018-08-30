const express = require('express');
const fs = require('fs');
const http = require('http');
const path = require("path");
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const errorhandler = require('errorhandler');
const connectMongo = require('connect-mongo')(session);
const morgan = require('morgan');
const methodOverride = require('method-override');

const isProduction = process.env.NODE_ENV === 'production';

const mongoProdUrl = process.env.MONGODB_URI + '/gittus';
const mongoDevUrl = 'mongodb://localhost/gittus';

const app = express();

// Use cool stuff
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.resolve(__dirname, '/public')));

if (isProduction) {
  mongoose.connect(mongoProdUrl, { useNewUrlParser: true });
} else {
  mongoose.connect(mongoDevUrl, { useNewUrlParser: true });
  mongoose.set('debug', true);
}

app.use(session({ store: new connectMongo({ mongooseConnection: mongoose.connection }), secret: 'gittus', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

require('./models/User');

app.use(require('./routes'));

// Set to 404 and forward to ERR handler ( if no routes match )
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});


if (!isProduction) {
  // Development ERR handler
  // with stack trace
  app.use((err, req, res, next) => {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      'errors': {
        message: err.message,
        error: err
      }
    });
  });
}

// Production ERR handler with no stack trace
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    'errors': {
      message: err.message,
      error: {}
    }
  });
});

app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000!'))