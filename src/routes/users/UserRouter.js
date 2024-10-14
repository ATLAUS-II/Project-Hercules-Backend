const express = require('express')
const { User } = require('../../../models')

const router = express.Router()

// GET User by ID and if no user is found, create user.
router.get('/', async (req, res, next) => {
  const userInfo = JSON.parse(req.headers['x-user-info'])
  const userId = userInfo.userId

  try {
    let user = await User.findOne({ userId: userId })

    if (!user) {
      user = await User.create({
        nickname: userInfo.displayName,
        email: userInfo.email,
        userId: userId
      })

      await user.populate('workouts')
      return res.status(201).send({ user })
    }

    await user.populate('workouts')
    res.status(200).send({ user })
  } catch (err) {
    console.log(err.message)
    next(err)
  }
})

router.get('/all', async (req, res, next) => {
  try {
    const users = await User.find()

    if (users.length < 1) {
      res.status(404).send({ message: 'There are no Users' })
    }
    res.status(200).send({ users })
  } catch (error) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const userById = await User.findById(id)

    if (!userById) {
      return res.status(404).send({ message: 'User not found' })
    }

    res.status(200).send({ user: userById })
  } catch (error) {
    next(error)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const update = req.body
    const userById = await User.findByIdAndUpdate(id, update, { new: true }) // {new:true} returns updated document

    if (!userById) {
      res.status(404).send({ message: 'User Not Found' })
    }

    res.status(200).send({ user: userById })
  } catch (error) {
    next(error)
  }
})

module.exports = router
