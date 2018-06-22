const { parse, serialize } = require('cookie')

module.exports = ({ sessionServiceClient, cookieDomain }) => async (
  _,
  req,
  res,
) => {
  const cookies = parse((req.headers && req.headers.cookie) || '')
  if (cookies.payload_session_token) {
    await sessionServiceClient.call('destroySession', {
      token: cookies.payload_session_token,
    })
    res.setHeader(
      'Set-Cookie',
      serialize('payload_session_token', cookies.payload_session_token, {
        maxAge: 0,
        domain: cookieDomain,
        path: '/',
        httpOnly: true,
      }),
    )
    return { logout: true }
  }
  return { logout: false }
}
