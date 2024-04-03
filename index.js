const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const database_user = process.env.USERNAME;
const database_password = process.env.PASSWORD;
const database_name = process.env.DATABASE;
const database_connection = "mongodb+srv://" + database_user + ":" + database_password + "@" + database_name + ".mongodb.net/?retryWrites=true&w=majority&appName=prayerdata";


app.use((req, res, next) => {
    res.status(404).send('Page not found! Error 404!')
});

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
    console.log("Server is listening on port " + port);
})

