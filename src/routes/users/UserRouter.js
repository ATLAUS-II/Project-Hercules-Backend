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
    const user = await User.findById({ userId })

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

// TODO: Delete after tests.
router.get('/test', (req, res, next) => {
  const userInfo = JSON.parse(req.headers['x-user-info'])

  const userId = userInfo.sub.split('|')[1]

  console.log(userInfo, userId)
  res.status(200).send({ msg: 'test route hit!' })
})

module.exports = router
