const express = require('express')
const { User } = require('../../../models')

const router = express.Router()

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


module.exports = router
