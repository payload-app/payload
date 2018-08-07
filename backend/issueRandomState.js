const { send } = require('micro')

module.exports = ({ randomStateServiceClient }) => async (req, res) => {
  try {
    const { state } = await randomStateServiceClient.call('createState')
    return send(res, 200, { state })
  } catch (error) {
    return send(res, 400, { message: 'Could not get random state' })
  }
}
