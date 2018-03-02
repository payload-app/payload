const cookie = require('cookie')
const ms = require('ms')
const updateOrCreateUser = require('./updateOrCreateUser')
// const updateOrCreateOrganizations = require('./updateOrCreateOrganizations')
// const updateOrCreateRepos = require('./updateOrCreateRepos')

module.exports = async ({
  userServiceClient,
  // organizationServiceClient,
  sessionServiceClient,
  // repoServiceClient,
  githubServiceClient,
  accessToken,
  res,
}) => {
  const { userId, created, user } = await updateOrCreateUser({
    userServiceClient,
    githubServiceClient,
    accessToken,
  })
  // TODO only updates and creates organizations when a user is created
  // we'll need to add some sort of resync
  // if (created) {
  // const { organizations } = await updateOrCreateOrganizations({
  //   userServiceClient,
  //   organizationServiceClient,
  //   githubServiceClient,
  //   userId,
  //   accessToken,
  // })
  //
  // await updateOrCreateRepos({
  //   githubServiceClient,
  //   repoServiceClient,
  //   user,
  //   userId,
  //   organizations,
  //   accessToken,
  // })
  // }
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
}
