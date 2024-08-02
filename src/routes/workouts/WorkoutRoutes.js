const express = require('express')
const { Workout } = require('../../../models')

const router = express.Router()



router.get("/all", async(req, res, next) => {
    try {
        const workouts = await Workout.find()
    
        if(workouts.length < 1) {
            res.status(404).send({message: "There are no Workouts"})
        }
        
        res.status(200).send({ workouts })
        } catch (error) {
            next(error)
        }
})


router.get("/:id", async(req, res, next) =>{
    try {
        const workoutId = req.params.id
        const workoutById = await Workout.findById(workoutId)

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
        const workoutId = req.params.id
        const workoutById = await Workout.findByIdAndUpdate(workoutId, workoutUpdate, { new: true })

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

router.delete("/:id", async (req, res, next) => {
    try {
        const workoutId = req.params.id
        const workoutById = await Workout.findByIdAndDelete(workoutId, {new: true})

        if (!workoutById) {
            res.status(404).send({ message: "Workout Not Found"})
        }

        res.status(200).send({ 
            message: "Workout Deleted", 
            workout: workoutById })
    } catch (error) {
        
    }
})

module.exports = router