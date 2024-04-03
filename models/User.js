const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    prayer_data: {
        request: String,
        notes: {
            date: Date,
            note: String
        }
    }
});

module.exports = mongoose.model("User", userSchema);