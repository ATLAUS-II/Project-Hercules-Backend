const express = require('express')
const { Workout, User, Exercise } = require('../../../models')
const { default: mongoose } = require('mongoose')


const router = express.Router()

router.get("/all", async(req, res, next) => {
    try {
        const workouts = await Workout.find()
    
        if(workouts.length < 1) {
            res.status(404).send({ message: "There are no Workouts" })
        }
        
        res.status(200).send({ workouts })
        } catch (error) {
            next(error)
        }
})


router.get("/:id", async(req, res, next) =>{
    try {
        const { id } = req.params 
        const workoutById = await Workout.findById(id)

        if (!workoutById) {
            res.status(404).send({ message: "Workout not found"})
        }

        res.status(200).send({ workouts: workoutById })
    } catch (error) {
        next(error) 
    }
})

router.patch("/:id", async (req, res, next) => {
    try {
        const workoutUpdate = req.body
        const { id } = req.params
        const workoutById = await Workout.findByIdAndUpdate(id, workoutUpdate, { new: true })

        if (!workoutById) {
            res.status(404).send({ message: "Workout Not Found"})
        }

        res.status(200).send({
            message: "Workout updated",
            workout: workoutById
        })
    } catch (error) {
        next(error)
    }
})


router.post("/userId/:userId/", async (req, res, next) => {
    try {
        const { userId } = req.params 
        const user = await User.findById(userId).populate("workouts")
        
        if (!user){
            res.status(404).send({ message: `User not found with id: ${userId}` })
        }

        const { level, type, focus_area, exercises } = req.body
        
        const createdExercise = await Exercise.create(exercises);
        
        const exerciseIds = createdExercise.map(exercise => exercise._id)

        const newWorkout = new Workout({
            level, 
            focusArea: focus_area,
            type, 
            exercises: exerciseIds
        })

        const savedWorkout = await newWorkout.save()
        user.workouts.push(savedWorkout)
        await user.save()

        res.status(201).send(savedWorkout)
    } catch (error) {
        next(error)
    }
    
})

router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params 
        const workoutById = await Workout.findByIdAndDelete(id)

        if (!workoutById) {
            res.status(404).send({ message: "Workout Not Found"})
        }

        res.status(200).send({ 
            message: "Workout Deleted", 
            workout: workoutById 
        })
    } catch (error) {
        
    }
})

module.exports = router