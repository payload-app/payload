const { parse, serialize } = require('cookie')

module.exports = ({ sessionServiceClient }) => async (_, req, res) => {
  const cookies = parse((req.headers && req.headers.cookie) || '')
  if (cookies.local_payload_session) {
    await sessionServiceClient.call('destroySession', {
      token: cookies.local_payload_session,
    })
    res.setHeader(
      'Set-Cookie',
      // TODO: detect env for local vs prod cookies -- env var
      serialize('local_payload_session', cookies.local_payload_session, {
        maxAge: 0,
        domain: '.local.payloadapp.com',
        path: '/',
      }),
    )
    console.log('res.getHeaders()', res.getHeaders())
  }
  return 'meep'
}
