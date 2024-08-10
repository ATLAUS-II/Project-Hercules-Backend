const { Schema } = require('mongoose')

const Exercise = new Schema({
  name: {
    type: String,
    required: true
  },
  reps: {
    type: Number,
    required: true
  },
  sets: {
    type: Number,
    required: true
  }
})

module.exports = Exercise
