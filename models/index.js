const { model } = require("mongoose")
const UserSchema = require("./User")
const WorkoutSchema = require("./Workout")
const ExerciseSchema = require("./Exercise")

const User = model('User', UserSchema)
const Workout = model("Workout", WorkoutSchema)
const Exercise = model("Exercise", ExerciseSchema)

module.exports = { 
    User, 
    Workout,
    Exercise
}
