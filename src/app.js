require('dotenv').config()
const express = require('express')
const { createServer } = require('http')
const cors = require('cors')
const {
  UserRouter,
  GeminiRouter,
  WorkoutRouter,
  ExerciseRouter
} = require('./routes')
const morgan = require('morgan')
const { auth } = require('express-oauth2-jwt-bearer')
const { AUTH0_SECRET, AUTH0_AUDIENCE, AUTH0_BASE_URL, AUTH0_SIGNING_ALGO } =
  process.env

const jwtCheck = auth({
  secret: AUTH0_SECRET,
  audience: AUTH0_AUDIENCE,
  issuerBaseURL: AUTH0_BASE_URL,
  tokenSigningAlg: AUTH0_SIGNING_ALGO
})

const app = express()
const httpServer = createServer(app)

app.use(cors())
app.use(morgan('dev'))

app.get('/', (req, res) => res.status(200).end())
app.get('/favicon.ico', (req, res) => res.status(204).end())

app.use(jwtCheck)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/users', UserRouter)

app.use('/api/v1/gemini', GeminiRouter)

app.use('/api/v1/workouts', WorkoutRouter)

app.use('/api/v1/exercises', ExerciseRouter)

module.exports = {
  httpServer
}
