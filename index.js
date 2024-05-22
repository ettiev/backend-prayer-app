const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require('dotenv').config();

const userRoutes = require("./routes/user.routes");

const User = require("./models/user");

const app = express();

app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200
}));

// Setting Headers
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type",
      "X-Requested-With"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });


//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const database_user = process.env.DBUSER;
const database_password = process.env.PASSWORD;
const database_name = process.env.DATABASE;
const database_connection = "mongodb+srv://" + database_user + ":" + database_password + "@" + database_name + ".mongodb.net/?retryWrites=true&w=majority&appName=prayerdata";

// Store Session and User in DB
const store = new MongoDBStore({
    uri: database_connection,
    collection: "session"
});

const database_secret = process.env.DBSECRET;
app.use(session({
    secret: database_secret, 
    resave: false, 
    saveUninitialized: false,
    store: store
}));

app.use((req, res, next) => {
    if (!req.session.user) {
        req.session.isLoggedIn = false;
        return next();
    };
    User.findById(req.session.user._id)
    .then((user => {
        req.user = user;
        req.session.isLoggedIn = true;
        next();
    }))
    .catch(err => {
        console.log(err);
    });
});

// To check if user is logged in
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

// All App Routes
app.use(userRoutes)

// Connect to Database and Start Server
mongoose.connect(database_connection)
    .then(
        (result) => {
            const port = process.env.PORT || 4000;
            const server = app.listen(port, () => {
                console.log("Server is listening on port " + port);
            })
        }
    ).catch(
        (err) => {
            console.log(err)
        }
    );

