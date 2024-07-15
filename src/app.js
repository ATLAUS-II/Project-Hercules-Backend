require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { UserRouter } = require('./routes')
// TODO: Get from an index
const { checkUser } = require('./middleware/checkUser')
const morgan = require('morgan')
const { auth } = require('express-oauth2-jwt-bearer')
const { AUTH0_SECRET, AUTH0_AUDIENCE, AUTH0_BASE_URL, AUTH0_SIGNING_ALGO } =
  process.env

const app = express()

const jwtCheck = auth({
  secret: AUTH0_SECRET,
  audience: AUTH0_AUDIENCE,
  issuerBaseURL: AUTH0_BASE_URL,
  tokenSigningAlg: AUTH0_SIGNING_ALGO
})

app.use(cors())
app.use(morgan('dev'))
app.use(jwtCheck)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use(checkUser)

app.get('/', (req, res) => {
  res.json({ msg: 'Hello, World' })
})

app.use('/api/v1/users', UserRouter)

module.exports = {
  app
}
