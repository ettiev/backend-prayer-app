//const mongoose = require("mongoose");
const path = require("path");
const express = require("express");

const router = express.Router();

const userSchema = require("../models/user");
const requestSchema = require("../models/request");
const noteSchema = require("../models/note"); 
const userController = require("../controllers/user");

//New User
router.post("/new_user", userController.postNewUser);

//Login
router.post("/user", userController.postLogin);

//Get Username
router.get("/login_status", userController.getLoginStatus);

//Get Prayer and Answered Requests
router.get("/requests", userController.getRequests);

//Add Request
router.post("/add_request", userController.postAddRequest);

//Answered Request
router.put("/answer_request/:requestId", userController.putAnswerRequest);

//Remove Request
router.delete("/delete_request/:requestId", userController.deleteRemoveRequest);

//Add Note
router.post("/add_note/:requestId", userController.postAddNote);

//Remove Note
router.delete("/remove_note/:noteId", userController.deleteRemoveNote);

//Logout
router.delete("/logout", userController.deleteLogout);

module.exports = router;