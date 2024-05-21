const mongoose = require('mongoose');

const User = require("../models/user");
const Request = require("../models/request");
const Note = require("../models/note");


//New User
exports.postNewUser = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password === confirmPassword) {
        const newUser = new User({
            username: username,
            email: email,
            password: password
        })
        return newUser.save()
        .then((result) => {
            console.log("User successfully created!")
            res.status(200).json({
                message: "New User is saved!!",
                body: result,
            })
        })
        .catch((err) => console.log(err))   
    } else {
        throw(
            "Passwords entered, do not match!"
        )
    }
};
        //Test if user already exist
//     User.findOne({email: email})
//         .then(userDoc => {
//             if (userDoc) {
//                 req.flash("error", "E-mail already registered! Login with a valid password.");
//                 return res.redirect("/signup");    
//             }
//          // Encrypt and Hash Password   
//          return bcrypt.hash(password, 12)
//             .then(hashedPassword => {
//                 const user = new User({
//                     email: email,
//                     password: hashedPassword,
//                     cart: { items: [] }
//                 });
//                 return user.save();
//             })
//             .then(result => {
//                 res.redirect("/login")
//             })
//             .catch(err => console.log(err))
//         })
// }

//Login User
exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
    .then((user => {
        if (user && password === user.password) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((result, err) => {
                if (err) {console.log(err)};
                if (!err) {
                    console.log("User is logged in!");
                    console.log(req.session.user)
                    res.status(200).json({
                        message: "Fetched requests successfully!",
                        body: req.session.user,
                    })
                };
            })         
        } else {
            throw("The email or password that was entered is invalid!");
        }
    }))
    .catch(err => {
        console.log(err);
    });

//         if (!user) {
//             req.flash("error", "Invalid email or password!")
//             return res.redirect('/login');
//         }
//         bcrypt.compare(password, user.password)
//         .then(doMatch => {
//             if (doMatch) {
//                 req.session.isLoggedIn = true;
//                 req.session.user = user;
//                 return req.session.save((err) => {
//                     if (err) {console.log(err)};
//                     res.redirect("/");
//                 })
//             }
//             req.flash("error", "Invalid email or password!");
//             res.redirect("/login")

//         })
//         .catch((err) => {
//             console.log(err);
//             redirect("/login");
//         })
        
//     }))
//     .catch(err => {
//         console.log(err);
//     });
// }
}

exports.getLoginStatus = async (req, res, next) => {
    if (req.session.isLoggedIn === true) {
        res.status(200).json({
            message: "Fetched login status successfully!",
            body: {
                isLoggedIn: true,
                user: req.session.user
            } 
        });    
    } else {
        res.status(200).json({
            message: "Fetched login status successfully!",
            body: {
                isLoggedIn: false,
                user: ''
            } 
        });    
    }
    
}

//Get Prayer and Answered Requests
exports.getRequests = async (req, res, next) => {
    console.log("LoggedIn: " + req.session.isLoggedIn);
    if (req.session.isLoggedIn) {
        Request.find({"userId": req.user._id})
        .then((result) => {
            const prayerRequests = [];
            const answeredRequests = [];

            result.map((request) => {
                if (request.answered) {
                    answeredRequests.push(request)
                } else {
                    prayerRequests.push(request)
                }
            })
            
            return (
                res.status(200).json({
                    message: "Fetched requests successfully!",
                    body: { 
                        pRequests: prayerRequests,
                        aRequests: answeredRequests
                    }
                })
            )
        })
        .catch(
            err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                    console.log(err);
                }
            }    
        )
    } 
    // else {
    //     throw("There is no user logged in!");
    // }
}    

// Get Single Request
exports.getSingleRequest = async (req, res, next) => {
    const requestId = req.body.requestId;
    
    Request.findOne({ requestId: requestId })
    .then((result) => {
        res.status(200).json({
        message: "Fetched request successfully!",
        body: result,
        })
    }) 
    .catch(err => {
        console.log(err);
    });    
}

//Add Request
exports.postAddRequest = async (req, res, next) => {
    const request = req.body.request;
    const description = req.body.description;
    const note = req.body.note;
    let message = "";
    
    const newRequest = new Request({
        userId: req.session.user._id,
        request: request,
        description: description,
        answered: false
    })
    return newRequest.save()
    .then((result, err) => {
        if (!err) {
            message = message + "New request added! "
            if (note.length > 0) {
                const newNote = new Note({
                    requestId: result._id,
                    date: new Date(),
                    note: note
                })
                message = message + "New note added!"
                return newNote.save()
            }
        } else {
            next()
        }
    })
    .then((result, err) => {
        if (err) {console.log(err)};
        if (!err) {
            console.log(message);
            res.status(200).json({
                message: "Request added!",
            })
        };
    });     
}

//Answered Request
exports.putAnswerRequest = async (req, res, next) => {
    const stringId = req.params.requestId;
    const requestId = new mongoose.Types.ObjectId(stringId);
    Request.findByIdAndUpdate(requestId, {answered: true})
    .then((result) => {
        res.status(200).json({
            message: "Fetched requests successfully!",
            body: result,
        })
    })
    .catch( (err) => {
        console.log(err);
    });
}

//Edit Request
exports.putEditRequest = async (req, res, next) => {
    const stringId = req.params.requestId;
    const requestId = new mongoose.Types.ObjectId(stringId);
    const request = req.body.request;
    const description = req.body.description;
    Request.findByIdAndUpdate(requestId, {
        request: request,
        description: description
    })
    .then((result) => {
        res.status(200).json({
            message: "Fetched requests successfully!",
            body: result,
        })
    })
    .catch( (err) => {
        console.log(err);
    });
}

//Remove Request
exports.deleteRemoveRequest = async (req, res, next) => {
    const stringId = req.params.requestId;
    const requestId = new mongoose.Types.ObjectId(stringId);
    Request.findByIdAndDelete(requestId)
    .then((result) => {
        res.status(200).json({
            message: "Fetched requests successfully!",
            body: result,
        })
    })
    .catch( (err) => {
        console.log(err);
    });
}

//Add Note
exports.postAddNote = async (req, res, next) => {
    const requestId = new mongoose.Types.ObjectId(req.body.requestId);
    const date = req.body.date;
    const note = req.body.note;
    let message;
    
    if (note.length > 0) {
        const newNote = new Note({
            requestId: requestId,
            date: date,
            note: note
        })
        message = "New note added!"
        return newNote.save()
        .then((result, err) => {
            if (err) {console.log(err)};
            if (!err) {
                console.log(message);
                res.status(200).json({
                    message: message,
                })
            };
        });
    } else {
        throw("The 'note' field cannot be empty");
    };
};

//Get Notes
exports.getNotes = async (req, res, next) => {
    const requestId = req.params.requestId;
    Note.find({"requestId": requestId})
    .then(result => {
        return (
            res.status(200).json({
                message: "Fetched requests successfully!",
                body: result
            })
        )    
    })
    .catch((err) => {
        console.log(err); 
    });
}

//Remove Note
exports.deleteRemoveNote = async (req, res, next) => {
    const noteId = req.params.noteId;
    Note.findByIdAndDelete(noteId)
    .then((result) => {
        res.status(200).json({
            message: "Fetched requests successfully!",
            body: result,
        })
    })
    .catch( (err) => {
        console.log(err);
    });
}

//Logout
exports.deleteLogout = async (req, res, next) => {
    const username = req.body.username;
    const userId = req.body._id;
    req.session.isLoggedIn = false;
    req.session.user = '';
    res.status(200).json({
        message: username + "(" + userId + ") was logged out.",
    })
    console.log(username + "(" + userId + ") was logged out.")
}