const { Schema } = require('mongoose')

const User = new Schema(
  {
    nickname: { type: String, required: true },
    email: { type: String, required: true },
    userId: { type: String, required: true }
  },
  { timestamps: true }
)

module.exports = User
