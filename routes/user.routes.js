const mongoose = require("mongoose");
const express = require("express");

const router = express.Router;

const userSchema = require("../models/User");

//New User
router.post("/new_user", (req, res, next) => {

})

//Get User Data
router.get("/user", (req, res, next) => {

})

//Add Request
router.put("/add_request", (req, res, next) => {

})

//Answered Request
router.put("/answered_request", (req, res, next) => {

})

//Remove Request
router.put("/remove_request", (req, res, next) => {

})

//Remove Answered Request
router.put("/remove_answered_request", (req, res, next) => {

})

//Add Note
router.put("/add_note", (req, res, next) => {

})

//Remove Note
router.put("/remove_note", (req, res, next) => {

})

module.exports = router;