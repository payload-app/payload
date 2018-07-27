const { createError } = require('@hharnisc/micro-rpc')
const { getUserFromSession } = require('./utils')

module.exports = (_, { session }) => {
  try {
    return getUserFromSession({ session })
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
