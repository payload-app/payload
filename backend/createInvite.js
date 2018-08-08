const cookie = require('cookie')
const ms = require('ms')
const { send, json } = require('micro')
const redirect = require('micro-redirect')

module.exports = ({
  randomStateServiceClient,
  inviteServiceClient,
  cookieDomain,
}) => async (req, res) => {
  try {
    const { state, email } = await json(req)
    if (!state || !email) {
      return send(res, 400, { message: 'state and email are required' })
    }
    const { valid } = await randomStateServiceClient.call('validateState', {
      state,
    })
    if (!valid) {
      return send(res, 400, { message: 'Invalid random state' })
    }
    try {
      await inviteServiceClient.call('create', {
        email,
      })
    } catch (error) {
      if (!error.message.includes('E11000')) {
        throw error
      }
    }
    const { inviteCookieToken } = await inviteServiceClient.call(
      'createInviteCookieToken',
      {
        email,
      },
    )
    await randomStateServiceClient.call('deleteState', { state })
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('payload_invite', inviteCookieToken, {
        maxAge: ms('30 days') / 1000,
        domain: cookieDomain,
        path: '/',
        httpOnly: false,
      }),
    )
    return send(res, 200, { message: 'OK' })
  } catch (error) {
    console.error(error)
    return send(res, 400, { message: 'Could not create invite' })
  }
}
