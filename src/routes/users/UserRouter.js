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


router.get("/all", async(req, res, next) => {
  try {
    const users = await User.find()

    if(users.length < 1) {
      res.status(404).send({message: "There are no Users"})
    }
    res.status(200).send({ users })
  } catch (error) {
    next(err)
  }
})

router.get("/:id", async(req, res, next) => {
  try {
    const userId = req.params.id
    const userById = await User.findById(userId)
    
    if (!userById) {
      return res.status(404).send({ message: "User not found" })
    }
    
    res.status(200).send({user: userById})
  } catch (error) {
    next(error)
  }
})

router.patch("/:id", async(req, res, next) => {
  try {
    const update = {
      nickname: req.body.nickname,
      email:req.body.email,
    }
    const userId = req.params.id
    const userById = await User.findByIdAndUpdate(userId, update, { new: true }) // {new:true} returns updated document
    
    if (!userById) {
      res.status(404).send({ message: "User Not Found" })
    }

    res.status(200).send({ user: userById })
  } catch (error) {
    next(error)
  }
})


module.exports = router
