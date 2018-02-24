const throwDisplayableError = ({ message }) => {
  const error = new Error(message)
  error.displayable = true
  throw error
}
module.exports = {
  throwDisplayableError,
}
