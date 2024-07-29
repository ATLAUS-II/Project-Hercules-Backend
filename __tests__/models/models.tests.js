const mongoose = require("mongoose")
const { beforeAll, describe, test, expect } = require("@jest/globals")
const {User, Workout, Exercise} = require("../../models/index")
const {memoryServerConnect, memoryServerDisconnect} = require("../../db/dbUtil.js")



describe("User Model test", () => {
    let mongoServer

    const userId1 = new mongoose.Types.ObjectId('66a718251992ede18b039ae4')
    const workoutId = new mongoose.Types.ObjectId

    const mockUser = {
        _id: userId1,
        userId: "1",
        nickname: "Phil",
        email: "Phil@test.com",
        workoutIds:[]
    }

    const mockWorkout = {
        _id: workoutId,
        type: "Pull Up",
        level:"Intermediate",
        focusArea: "Back",
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

        console.log(user)
    })
})