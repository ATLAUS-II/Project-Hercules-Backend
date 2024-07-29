const { Schema } = require("mongoose")

const Exercise = new Schema({
    name: {
        type: String,
        required: true 
    },
    Rep: {
        type: Number,
        required: true
    },
    Set: {
        type: Number,
        required: true
    }
})


module.exports = Exercise