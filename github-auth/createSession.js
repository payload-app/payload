const cookie = require('cookie')
const ms = require('ms')
const updateOrCreateUser = require('./updateOrCreateUser')
const updateOrCreateOrganizations = require('./updateOrCreateOrganizations')

module.exports = async ({
  userServiceClient,
  organizationServiceClient,
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
  // TODO only updates and creates organizations when a user is created
  // we'll need to add some sort of resync
  if (created) {
    await updateOrCreateOrganizations({
      userServiceClient,
      organizationServiceClient,
      githubServiceClient,
      userId,
      accessToken,
    })
  }
  const token = await sessionServiceClient.call('createSession', {
    userId,
  })
  console.log('token', token)
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('local_payload_session', token, {
      httpOnly: true,
      maxAge: ms('30 days') / 1000,
      domain: '.local.payloadapp.com',
    }),
  )
}
