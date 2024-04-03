const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
    console.log("Server is listening on port " + port);
})

