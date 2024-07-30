const { Schema } = require('mongoose')

const User = new Schema(
  {
    nickname: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    userId: { 
      type: String, 
      required: true 
    },
    workouts:[
      {
        type: Schema.Types.ObjectId,
        ref: "Workout"
      }
    ]
  },
  { timestamps: true }
)

module.exports = User
