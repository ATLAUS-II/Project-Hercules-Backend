const { Schema } = require("mongoose")

const Workout = new Schema(
    {
        focusArea: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        level: {
            type: String,
            required: true
        },
        exercise: [{
            type: Schema.Types.ObjectId, 
            ref: "Exercise"
        }]
    },
    { timestamps: true }
    
)


module.exports = Workout