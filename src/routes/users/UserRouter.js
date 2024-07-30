const express = require('express')
const { User } = require('../../../models')

const router = express.Router()

// [ADMIN] POST Create a new User.
router.post('/', async (req, res, next) => {
  const { nickname, email, userId } = req.body
  try {
    const user = await User.create({ nickname, email, userId })
    res.status(201).send({ user })
  } catch (error) {
    next(error)
  }
})

// GET User by ID and if no user is found, create user.
router.get('/', async (req, res, next) => {
  const userInfo = JSON.parse(req.headers['x-user-info'])
  // TODO: Parse the sub to get the Auth0 user ID.
  const userId = userInfo.sub.split('|')[1]
  try {
    const user = await User.findOne({ userId: userId })

    if (!user) {
      const newUser = await User.create({
        nickname: userInfo.nickname,
        email: userInfo.email,
        userId: userId
      })
      return res.status(201).send({ user: newUser })
    }

    res.status(200).send({ user })
  } catch (err) {
    next(err)
  } 
})

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find()
    console.log(users)
    res.send(users)
  } catch(error) {
    res.statusCode(500).send({ error })
  }
})

router.get("/users/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const user = await User.findById(id)
    res.send(user)
  } catch (error) {
    res.statusCode(404).send({ error })
  }
})

router.post("/users", async (req, res, next) => {
  const user = new User(req.body);

  try {
    console.log("Received Data, ", req.body)
    await user.save({ new: true })
  } catch (error) {
    res.statusCode(500).send(error) 
  }
})

module.exports = router
