const User = require("../models/user");

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
//             return bcrypt.hash(password, 12)
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

//Get User Data
exports.getUser = (req, res, next) => {
    
}

//Add Request
exports.postAddRequest = (req, res, next) => {

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