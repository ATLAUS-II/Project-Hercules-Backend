const { Schema } = require("mongoose")

const Exercise = new Schema({
    name: {
        type: String,
        required: true 
    },
    rep: {
        type: Number,
        required: true
    },
    set: {
        type: Number,
        required: true
    }
})


module.exports = Exercise