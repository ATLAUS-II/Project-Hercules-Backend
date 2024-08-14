const { app } = require('./src/app')
const { db } = require('./db/connection')

const port = process.env.PORT || 3001

app.listen(port, () => {
  db.on('error', console.error.bind(console, 'MongoDB connection error:'))
  console.log(`Server is running on port ${port}`)
})
