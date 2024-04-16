const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const requestSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    request: {
        type: String,
        required: true
    },
    answered: {
        type: Boolean,
        required: true
    }    
});

module.exports = mongoose.model("Request", requestSchema);  
        