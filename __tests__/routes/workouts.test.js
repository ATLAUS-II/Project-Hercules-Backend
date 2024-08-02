const {
    describe,
    test,
    expect,
    beforeEach,
    afterEach,
    beforeAll,
    afterAll,
} = require("@jest/globals");
const request = require("supertest");
const { app } = require("../../src/app");

const { Workout } = require("../../models");
const { memoryServerConnect, memoryServerDisconnect, clearDatabase,} = require("../../db/dbUtil");
const mongoose = require("mongoose");
const { json } = require("express");
const { WorkoutRouter } = require("../../src/routes");

// // Mock the express-oauth2-jwt-bearer module.
// jest.mock("express-oauth2-jwt-bearer", () => ({
//     auth: jest.fn(() => {
//         return (req, res, next) => {
//             next();
//         };
//     })
// }));


describe("Workout Integration Tests", () => {
    const workoutId = new mongoose.Types.ObjectId('66acf8aa81a040c542f016c1')

    const mockWorkout1 = {
        _id: workoutId,
        type: "Strength Training",
        level:"Intermediate",
        focusArea: "Upper",
        exercise: []
    }

    const mockWorkout2 = {
        type: "Body Building",
        level:"Beginner",
        focusArea: "Lower",
        exercise: []
    } 

    const updatedWorkout = {
        type: "Body Building",
        level:"Advanced",
        focusArea: "Lower",
        exercise: []
    }

    beforeAll(async () => {
        await memoryServerConnect()
    })

    afterAll(async () => {
        await memoryServerDisconnect()
    });

    beforeEach(async () => {
        await clearDatabase()
    })

    test("Find all workouts", async () => {
        const newWorkout1 = await Workout.create(mockWorkout1)
        const newWorkout2 = await Workout.create(mockWorkout2)

        const allWorkouts = {
            newWorkout1,
            newWorkout2
        }

        const response = await request(app)
            .get('/api/v1/workouts/all')
            .set('X-User-Info', JSON.stringify(allWorkouts))

        expect(response.status).toBe(200)
        expect(response.body.workouts.length).toBeGreaterThan(0)
    })

    test("Find workout by Id", async () => {
        const newWorkout1 = await Workout.create(mockWorkout1)
        const newWorkout2 = await Workout.create(mockWorkout2)


        const allWorkouts = [
            newWorkout1,
            newWorkout2
        ] 
        
        const workoutById = await Workout.findById(allWorkouts[0]._id)

        const response = await request(app)
            .get(`/api/v1/workouts/${allWorkouts[0]._id}`)
            .set('X-User-Info', JSON.stringify(workoutById))
        
        expect(response.status).toBe(200)
        expect(response.body.workouts._id).toBe(allWorkouts[0]._id.toString())
    })

    test("Update Workout info", async () => {
        const newWorkout = await Workout.create(mockWorkout1) 
        const workoutById = await Workout.findByIdAndUpdate(workoutId, updatedWorkout, { new: true })

        const response = await request(app)
        .patch(`/api/v1/workouts/${workoutId}`)
        .send(updatedWorkout)  

        expect(response.status).toBe(200)
        expect(response.body.workout.level).toBe(updatedWorkout.level);
        expect(response.body.workout.focusArea).toBe(updatedWorkout.focusArea);
        expect(response.body.workout.type).toBe(updatedWorkout.type);

    })

    test("Delete a workout", async () => {
        const newWorkout1 = await Workout.create(mockWorkout1)

        const workoutById = await Workout.findByIdAndDelete(workoutId, { new: true })
        console.log(workoutById) 

        const deletedWorkout = await Workout.findById(newWorkout1._id)


        const response =  await request(app)
        .delete(`/api/v1/workouts/${workoutId}`)
        .send()    


        expect(response.status).toBe(404)
        expect(deletedWorkout).toBeNull()
    })
})


