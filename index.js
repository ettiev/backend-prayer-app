const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require('dotenv').config();

const userRoutes = require("./routes/user.routes");

const app = express();

app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200
}));


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
        return next();
    };
    User.findById(req.session.user._id)
    .then((user => {
        req.user = user;
        next();
    }))
    .catch(err => {
        console.log(err);
    });
});

// Check if user is logged in
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

// All App Routes
app.use(userRoutes)


// app.use(errorControllers.getPageNotFound); ??

// app.use((req, res, next) => {
//     res.status(404).send('Page not found! Error 404!')
// });



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

