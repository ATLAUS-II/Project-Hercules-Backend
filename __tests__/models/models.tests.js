const mongoose = require("mongoose")
const { beforeAll, describe, test, expect } = require("@jest/globals")
const {User, Workout, Exercise} = require("../../models/index")
const {memoryServerConnect, memoryServerDisconnect} = require("../../db/dbUtil.js")
const { populate } = require("dotenv")



describe("User Model test", () => {
    const userId1 = new mongoose.Types.ObjectId('66a718251992ede18b039ae4')
    const workoutId = new mongoose.Types.ObjectId('66a7f147486fd6a959ab2048')

    const mockUser = {
        _id: userId1,
        userId: "1",
        nickname: "Phil",
        email: "Phil@test.com",
        workouts:[]
    }

    const mockWorkout = {
        _id: workoutId,
        type: "Pull Up",
        level:"Intermediate",
        focusArea: "Back",
        exercise: []
    }

    beforeAll(async () => {
        await memoryServerConnect()

        await User.create()
        await Workout.create()
    })

    afterAll(async () => {
        await memoryServerDisconnect()
    })

    test("Create a new user", async () => {
        const user = await User.create(mockUser)

        expect(user).toBeInstanceOf(User)
        expect(user.name).toBe(mockUser.name)
        expect(user.email).toBe(mockUser.email)
        expect(user.workouts.length).toEqual(0)
    })

    test("Find User By Id", async () => {
        const user = await User.findById(userId1)

        expect(user).toBeInstanceOf(User)
        expect(user.name).toBe(mockUser.name)
        expect(user.email).toBe(mockUser.email)
        expect(user.workouts.length).toEqual(0)
    })

    test("Find all Users", async () => {
        const newUser = await User.create({
            userId: "2",
            nickname: "Bob",
            email: "Bob@test.com",
            workouts:[]
        })

        const allUsers = await User.find()

        expect(newUser).toBeInstanceOf(User)
        expect(allUsers.length).toEqual(2)
    })

    test("User info can be updated", async () => {
        const user = await User.findByIdAndUpdate(userId1,{nickname: "Phillip"})
        const updatedUser = await User.findById(userId1)

        expect(updatedUser.toObject()._id.toString()).toBe(mockUser._id.toString())
        expect(updatedUser.nickname).toBe("Phillip")
    })

    test("User can add exercises to workout", async () => {
        const workout = await Workout.create(mockWorkout)
        const user = await User.findById(userId1)
        user.workouts.push(workout)
        await user.save()

        const populatedUser = await User.findById(userId1).populate("workouts")
        console.log(populatedUser) 

        expect(workout).toBeInstanceOf(Workout) 
        expect(populatedUser.workouts[0]._id.toString()).toBe(workoutId.toString())
        expect(populatedUser.workouts[0].type).toBe(mockWorkout.type)
        expect(populatedUser.workouts[0].level).toBe(mockWorkout.level)
        expect(populatedUser.workouts[0].focusArea).toBe(mockWorkout.focusArea)
    })
})