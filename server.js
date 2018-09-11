const express = require("express");
const fs = require("fs");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const errorhandler = require("errorhandler");
const connectMongo = require("connect-mongo")(session);
const morgan = require("morgan");
const methodOverride = require("method-override");
const nconf = require("nconf");

nconf
  .argv()
  .env()
  .file("dbConfig.json");
const {
  dbUser,
  dbPass,
  dbHost,
  dbPort,
  dbDatabase,
  dbSSL,
  dbReplicaSet,
  dbAuthSource,
  dbClusterShards
} = nconf.get();
const isProduction = process.env.NODE_ENV === "production";

const devURI = "mongodb://localhost:27017/giteacher";
const prodURI = `mongodb://${dbUser}:${dbPass}@${dbClusterShards.join(
  ":" + dbPort + ","
)}/${dbDatabase}?ssl=${dbSSL}&replicaSet=${dbReplicaSet}&authSource=${dbAuthSource}`;

const app = express();

// Use cool stuff
app.use(cors());
if (isProduction) {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.resolve(__dirname, "/public")));

if (isProduction) {
  mongoose.connect(
    prodURI,
    { useNewUrlParser: true }
  );
} else {
  mongoose.connect(
    devURI,
    { useNewUrlParser: true }
  );
  mongoose.set("debug", true);
}

app.use(
  session({
    store: new connectMongo({ mongooseConnection: mongoose.connection }),
    secret: "gittus",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

require("./models/User");
require("./models/Tutorial");
require("./models/Step");
require("./config/passport");

app.use(require("./routes"));

// Set to 404 and forward to ERR handler ( if no routes match )
app.use((req, res, next) => {
  let err = new Error("Not Found");
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
      errors: {
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
    errors: {
      message: err.message,
      error: {}
    }
  });
});

app.listen(process.env.PORT || 4200, () =>
  console.log("Listening on port 4200!")
);
