const { parse } = require('cookie')

module.exports = ({ sessionServiceClient }) => async (_, req, res) => {
  const cookies = parse((req.headers && req.headers.cookie) || '')
  if (cookies.local_payload_session) {
    console.log('cookies.local_payload_session', cookies.local_payload_session)
    await sessionServiceClient.call('destroySession', {
      token: cookies.local_payload_session,
    })
  }
  return 'meep'
}
