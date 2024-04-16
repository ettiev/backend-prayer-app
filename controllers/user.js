const User = require("../models/user");
const Request = require("../models/request");
const Note = require("../models/note");

//New User
exports.postNewUser = (req, res, next) => {
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
        .then(() => console.log("User successfully created!"))
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
exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
    .then((user => {
        if (user && password === user.password) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
                if (!err) {
                    console.log("User is logged in!");
                    console.log(req.session.user);
                };
                if (err) {console.log(err)};
            })         
        } else {
            throw("The email or password that was entered is invalid!");
        }
    }))
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

exports.getUsername = (req, res, next) => {
    return (res.status(200).json({
        message: "Fetched username successfully!",
        username: req.session.user.username 
    }));
}

//Get User Info
exports.getRequests = (req, res, next) => {
    Request.find({"userId": req.user._id})
    .then((result) => {
        const requests = [];
        const answeredRequests = [];

        result.map((prayerRequest) => {
            if (prayerRequest.answered) {
                answeredRequests.push(prayerRequest)
            } else {
                requests.push(prayerRequest)
            }
        })
        return (
            res.status(200).json({
                message: "Fetched requests successfully!",
                requests: requests,
                answeredRequests: answeredRequests
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

//Add Request
exports.postAddRequest = (req, res, next) => {
    const request = req.body.request;
    const note = req.body.note;
    
    console.log("User:" + req.user);
    console.log("User Session" + req.session.user);

    const newRequest = new Request({
        userId: req.session.user._id,
        request: request,
        answered: false
    })
    newRequest.save()
    .then((result) => {
        const newNote = new Note({
            requestId: result._id,
            date: new Date(),
            note: note
        })
        newNote.save()
    })
}

//Answered Request
exports.postAnsweredRequest = (req, res, next) => {

}

//Remove Request
exports.deleteRemoveRequest = (req, res, next) => {

}

//Remove Answered Request
exports.deleteRemoveAnsweredRequest = (req, res, next) => {

}

//Add Note
exports.postAddNote = (req, res, next) => {

}

//Remove Note
exports.deleteRemoveNote = (req, res, next) => {

}