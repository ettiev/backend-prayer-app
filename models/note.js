const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    requestId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Request"
    }, 
    date: {
        type: Date,
        required: true
    },
    note: {
        type: String,
        required: true
    }   
});

module.exports = mongoose.model("Note", noteSchema);
