const cookie = require('cookie')
const ms = require('ms')
const updateOrCreateUser = require('./updateOrCreateUser')

module.exports = async ({
  userServiceClient,
  sessionServiceClient,
  githubServiceClient,
  accessToken,
  res,
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
    // TODO: detect env for local vs prod cookies -- env var
    cookie.serialize('local_payload_session', token, {
      maxAge: ms('30 days') / 1000,
      domain: '.local.payloadapp.com',
    }),
  )
  return {
    created,
  }
}
