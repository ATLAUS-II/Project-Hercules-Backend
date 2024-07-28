const { Schema } = require("mongoose")

const Workout = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        workouts: [{
            type: Schema.Types.ObjectId, 
            ref: "Workout"
        }]
    },
    { timestamps: true }
    
)


module.exports = Workout