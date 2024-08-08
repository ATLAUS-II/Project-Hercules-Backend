const { Schema } = require('mongoose')

const Workout = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    focusArea: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    level: {
      type: String,
      required: true
    },
    exercises: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Exercise'
      }
    ]
  },
  { timestamps: true }
)

module.exports = Workout
