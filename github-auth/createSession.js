const cookie = require('cookie')
const ms = require('ms')
const updateOrCreateUser = require('./updateOrCreateUser')

module.exports = async ({
  userServiceClient,
  sessionServiceClient,
  githubServiceClient,
  billingServiceClient,
  inviteServiceClient,
  randomStateMetadata,
  accessToken,
  res,
  cookieDomain,
}) => {
  const { userId, created, invited, userEmail } = await updateOrCreateUser({
    userServiceClient,
    githubServiceClient,
    billingServiceClient,
    inviteServiceClient,
    randomStateMetadata,
    accessToken,
  })
  if (!invited) {
    // delete payload_invite cookie
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('payload_invite', '', {
        maxAge: -1,
        domain: cookieDomain,
        path: '/',
        httpOnly: true,
      }),
    )
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
  } else {
    // create a cookie payload_invite -- contains a JWT with invite email
    const { inviteCookieToken } = await inviteServiceClient.call(
      'createInviteCookieToken',
      {
        email: userEmail,
      },
    )
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('payload_invite', inviteCookieToken, {
        maxAge: ms('30 days') / 1000,
        domain: cookieDomain,
        path: '/',
        httpOnly: true,
      }),
    )
  }
  return {
    created,
    invited,
  }
}
