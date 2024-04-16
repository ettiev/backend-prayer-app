const mongoose = require("mongoose");
const express = require("express");

const router = express.Router();

const userSchema = require("../models/user");
const requestSchema = require("../models/request");
const noteSchema = require("../models/note"); 
const userController = require("../controllers/user");

//New User
router.post("/new_user", userController.postNewUser);

//Get User Data
router.get("/user", userController.getUser);

//Add Request
router.post("/add_request", userController.postAddRequest);

//Answered Request
router.post("/answered_request", userController.postAnsweredRequest);

//Remove Request
router.delete("/remove_request", userController.deleteRemoveRequest);

//Remove Answered Request
router.delete("/remove_answered_request", userController.deleteRemoveAnsweredRequest);

//Add Note
router.post("/add_note", userController.postAddNote);

//Remove Note
router.delete("/remove_note", userController.deleteRemoveNote);

module.exports = router;