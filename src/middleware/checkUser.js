// const { User } = require('../../models')

const checkUser = async (req, res, next) => {
  const userInfo = JSON.parse(req.headers['x-user-info'])

  // TODO: Implement logic to check if the user exists in the database.
  console.log(userInfo)
  next()
}

module.exports = {
  checkUser
}
