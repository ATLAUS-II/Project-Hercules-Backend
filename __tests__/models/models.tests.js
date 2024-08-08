const mongoose = require('mongoose')
const { beforeAll, describe, test, expect } = require('@jest/globals')
const { User, Workout, Exercise } = require('../../models/index')
const {
  memoryServerConnect,
  memoryServerDisconnect
} = require('../../db/dbUtil.js')

describe('User Model test', () => {
  const userId = new mongoose.Types.ObjectId('66a718251992ede18b039ae4')
  const workoutId = new mongoose.Types.ObjectId('66a7f147486fd6a959ab2048')

  const mockUser = {
    _id: userId,
    userId: '1',
    nickname: 'Phil',
    email: 'Phil@test.com',
    workouts: []
  }

  const mockWorkout = {
    _id: workoutId,
    name: 'Test Upper Body Workout',
    type: 'Strength Training',
    level: 'Intermediate',
    focusArea: 'Upper',
    exercises: []
  }

  beforeAll(async () => {
    await memoryServerConnect()
  })

  afterAll(async () => {
    await memoryServerDisconnect()
  })

  test('Create a new user', async () => {
    const user = await User.create(mockUser)

    expect(user).toBeInstanceOf(User)
    expect(user.name).toBe(mockUser.name)
    expect(user.email).toBe(mockUser.email)
    expect(user.workouts.length).toEqual(0)
  })

  test('Find User By Id', async () => {
    const user = await User.findById(userId)

    expect(user).toBeInstanceOf(User)
    expect(user.name).toBe(mockUser.name)
    expect(user.email).toBe(mockUser.email)
    expect(user.workouts.length).toEqual(0)
  })

  test('Find all Users', async () => {
    const newUser = await User.create({
      userId: '2',
      nickname: 'Bob',
      email: 'Bob@test.com',
      workouts: []
    })

    const allUsers = await User.find()

    expect(newUser).toBeInstanceOf(User)
    expect(allUsers.length).toEqual(2)
  })

  test('User info can be updated', async () => {
    const user = await User.findByIdAndUpdate(userId, { nickname: 'Phillip' })
    const updatedUser = await User.findById(userId)

    expect(updatedUser.toObject()._id.toString()).toBe(mockUser._id.toString())
    expect(updatedUser.nickname).toBe('Phillip')
  })

  test('User can add exercises to workout', async () => {
    const workout = await Workout.create(mockWorkout)
    const user = await User.findById(userId)
    user.workouts.push(workout)
    await user.save()

    const populatedUser = await User.findById(userId).populate('workouts')

    expect(workout).toBeInstanceOf(Workout)
    expect(populatedUser.workouts[0]._id.toString()).toBe(workoutId.toString())
    expect(populatedUser.workouts[0].type).toBe(mockWorkout.type)
    expect(populatedUser.workouts[0].level).toBe(mockWorkout.level)
    expect(populatedUser.workouts[0].focusArea).toBe(mockWorkout.focusArea)
  })
})

describe('Workout Model Test', () => {
  const workoutId = new mongoose.Types.ObjectId('66a7f903231f90ac68d9ceb5')
  const exerciseId = new mongoose.Types.ObjectId('66a82b3a928ff2342b005ffa')

  const mockWorkout = {
    _id: workoutId,
    name: 'Test Upper Body Workout',
    type: 'Strength Training',
    level: 'Intermediate',
    focusArea: 'Upper',
    exercises: []
  }

  const mockExercise = {
    _id: exerciseId,
    name: 'Pull Up',
    rep: 10,
    set: 3
  }

  beforeAll(async () => {
    await memoryServerConnect()
  })

  afterAll(async () => {
    await memoryServerDisconnect()
  })

  test('Create a new workout', async () => {
    const workout = await Workout.create(mockWorkout)

    expect(workout).toBeInstanceOf(Workout)
    expect(workout.focusArea).toBe(mockWorkout.focusArea)
    expect(workout.level).toBe(mockWorkout.level)
    expect(workout.type).toBe(mockWorkout.type)
  })

  test('Find workout by Id', async () => {
    const workout = await Workout.findById(workoutId)

    expect(workout._id.toString()).toBe(workoutId._id.toString())
    expect(workout.focusArea).toBe(mockWorkout.focusArea)
    expect(workout.type).toBe(mockWorkout.type)
    expect(workout.level).toBe(mockWorkout.level)
  })

  test('Find all workouts', async () => {
    const newWorkout = await Workout.create({
      name: 'Test Lower Body Workout',
      focusArea: 'Lower',
      type: 'Body Building',
      level: 'Beginner',
      exercises: []
    })

    const workouts = await Workout.find()

    expect(newWorkout).toBeInstanceOf(Workout)
    expect(workouts.length).toEqual(2)
  })

  test('Exercise can be added to workout', async () => {
    const workout = await Workout.findById(workoutId).populate('exercises')
    const newExercise = await Exercise.create(mockExercise)

    workout.exercises.push(newExercise)
    await workout.save()

    expect(newExercise).toBeInstanceOf(Exercise)
    expect(workout.exercises[0].name).toBe(mockExercise.name)
    expect(workout.exercises[0].rep).toEqual(mockExercise.rep)
    expect(workout.exercises[0].set).toEqual(mockExercise.set)
  })

  test('Workout can be deleted', async () => {
    const workout = await Workout.findByIdAndDelete(workoutId)
    const workouts = await Workout.find()

    expect(workouts.length).toEqual(1)
  })
})

describe('Exercise Model Test', () => {
  const exerciseId = new mongoose.Types.ObjectId('66a831cd5183e13217b06a74')

  const mockExercise = {
    _id: exerciseId,
    name: 'Push Ups',
    rep: 10,
    set: 8
  }

  beforeAll(async () => {
    await memoryServerConnect()
  })

  afterAll(async () => {
    await memoryServerDisconnect()
  })

  test('Create an exercise', async () => {
    const exercise = await Exercise.create(mockExercise)

    expect(exercise).toBeInstanceOf(Exercise)
    expect(exercise.name).toBe(mockExercise.name)
    expect(exercise.rep).toEqual(mockExercise.rep)
    expect(exercise.set).toEqual(mockExercise.set)
  })

  test('Find exercise by Id', async () => {
    const exercise = await Exercise.findById(exerciseId)

    expect(exercise).toBeInstanceOf(Exercise)
    expect(exercise._id.toString()).toBe(exerciseId._id.toString())
    expect(exercise.name).toBe(mockExercise.name)
    expect(exercise.rep).toEqual(mockExercise.rep)
    expect(exercise.set).toEqual(mockExercise.set)
  })

  test('Exercise can be updated', async () => {
    const exercise = await Exercise.findByIdAndUpdate(exerciseId, {
      rep: 8,
      set: 2
    })
    const updatedExercise = await Exercise.findById(exerciseId)

    expect(exercise.toObject()._id.toString()).toBe(
      updatedExercise.toObject()._id.toString()
    )
    expect(updatedExercise.name).toBe('Push Ups')
    expect(updatedExercise.rep).toEqual(8)
    expect(updatedExercise.set).toEqual(2)
  })

  test('Exercise can be deleted', async () => {
    const exercise = await Exercise.findByIdAndDelete()

    expect(exercise).toBeNull()
  })
})
