const express = require('express')
const { UserRouter } = require('../routes')

const app = express()

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

app.use('/api/v1/users', UserRouter)

module.exports = {
  app
}
