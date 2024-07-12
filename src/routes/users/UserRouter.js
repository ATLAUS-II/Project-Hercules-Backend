const express = require('express')
const { User } = require('../../../models')

const router = express.Router()

// POST Create a new User.
// TODO: Will be replaced by middleware that handles creation of a new user.
router.post('/', async (req, res, next) => {
  const { nickname, email, userId } = req.body
  try {
    const user = await User.create({ nickname, email, userId })
    res.status(201).send({ user })
  } catch (error) {
    next(error)
  }
})

// GET User by ID.
// TODO Pass the user ID in the middleware.
// Main purpose of this is for testing purposes.
router.get('/', async (req, res, next) => {
  const { _id } = req.user
  try {
    const user = await User.findById(_id)
    if (!user) {
      return res.status(404).send({ message: `User with ID ${_id} not found.` })
    }
    res.status(200).send({ user })
  } catch (error) {
    next(error)
  }
})

module.exports = router
