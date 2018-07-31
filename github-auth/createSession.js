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
  admins,
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
    admins,
    accessToken,
  })
  if (!invited) {
    const token = await sessionServiceClient.call('createSession', {
      userId,
    })
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    res.setHeader('Set-Cookie', [
      cookie.serialize('payload_session_token', token, {
        maxAge: ms('30 days') / 1000,
        domain: cookieDomain,
        path: '/',
        httpOnly: true,
      }),
      // delete payload_invite
      cookie.serialize('payload_invite', '', {
        expires: weekAgo,
        domain: cookieDomain,
        path: '/',
        httpOnly: false,
      }),
    ])
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
        httpOnly: false,
      }),
    )
  }
  return {
    created,
    invited,
  }
}
