const { getUserFromSession } = require('./utils')

module.exports = (_, { session }) => {
  return getUserFromSession({ session })
}
