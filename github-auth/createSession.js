const cookie = require('cookie')
const ms = require('ms')
const updateOrCreateUser = require('./updateOrCreateUser')

module.exports = async ({
  userServiceClient,
  sessionServiceClient,
  githubServiceClient,
  accessToken,
  res,
  cookieDomain,
}) => {
  const { userId, created } = await updateOrCreateUser({
    userServiceClient,
    githubServiceClient,
    accessToken,
  })
  const token = await sessionServiceClient.call('createSession', {
    userId,
  })
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('payload_session_token', token, {
      maxAge: ms('30 days') / 1000,
      domain: cookieDomain,
      path: '/',
      httpOnly: true,
    }),
  )
  return {
    created,
  }
}
