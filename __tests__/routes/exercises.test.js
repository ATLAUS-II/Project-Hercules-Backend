const {
    describe,
    test,
    expect,
    beforeEach,
    beforeAll,
    afterAll,
} = require("@jest/globals");
const request = require("supertest");
const { app } = require("../../src/app");

const { Exercise } = require("../../models");
const { memoryServerConnect, memoryServerDisconnect, clearDatabase,} = require("../../db/dbUtil");
const mongoose = require("mongoose");
const { json } = require("express");

// Mock the express-oauth2-jwt-bearer module.
jest.mock("express-oauth2-jwt-bearer", () => ({
    auth: jest.fn(() => {
        return (req, res, next) => {
            next();
        };
    })
}));


describe("Exercise Integration Tests", () => {
    const mockExercise1 = {
        name: "Push Ups",
        rep: 8,
        set: 3
    }

    const mockExercise2 = {
        name: "Squats",
        rep: 15,
        set: 3
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

    test("/GET find all exercises", async () => {
        const newExercise1 = await Exercise.create(mockExercise1)
        const newExercise2 = await Exercise.create(mockExercise2)

        const allExercises = [
            newExercise1,
            newExercise2
        ]

        const response = await request(app)
            .get('/api/v1/exercises/all')
            .set('X-User-Info', JSON.stringify(allExercises))

        // console.log(response.body)
        expect(response.status).toBe(200)
        expect(response.body.exercises.length).toBeGreaterThan(0)
    })

    test("/GET find Exercise by Id", async () => {
        const newExercise1 = await Exercise.create(mockExercise1)
        const newExercise2 = await Exercise.create(mockExercise2)

        const allExercises = [
            newExercise1,
            newExercise2
        ]


        const exerciseById = await Exercise.findById(allExercises[0]._id)

        const response = await request(app)
            .get(`/api/v1/exercises/${allExercises[0]._id}`)
            .set('X-User-Info', JSON.stringify({ exercise: exerciseById }))

        expect(response.status).toBe(200)
        expect(response.body.exercise.name).toBe(mockExercise1.name)
        expect(response.body.exercise.rep).toEqual(8) 
        expect(response.body.exercise.set).toEqual(3)  

    })

    test("/PATCH update exercise info", async () => {
        const newExercise1 = await Exercise.create(mockExercise1)
        const exerciseById = await Exercise.findByIdAndUpdate(newExercise1._id, {
            rep: 15,
            set: 2
        }, { new: true })

        const response = await request(app)
            .patch(`/api/v1/exercises/${newExercise1._id}`)
            .send(exerciseById)
            
        expect(response.status).toBe(200) 
        expect(response.body.exercise.rep).toEqual(15)
        expect(response.body.exercise.set).toEqual(2)
    })

    test("/DELETE an exercise", async () => {
        const newExercise1 = await Exercise.create(mockExercise1)
        const exerciseById = await Exercise.findByIdAndDelete(newExercise1._id)
        const deletedExercise = await Exercise.findById(exerciseById._id)

        const response = await request(app)
            .delete(`/api/v1/exercises/${newExercise1._id}`)
            .send()


        expect(response.status).toBe(404)
        expect(deletedExercise).toBeNull() 
    })
})