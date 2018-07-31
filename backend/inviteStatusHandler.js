const { send } = require('micro')
const { parse } = require('cookie')

module.exports = ({ inviteServiceClient }) => async (req, res) => {
  // get payload_invite cookie
  const cookies = parse((req.headers && req.headers.cookie) || '')
  const inviteCookieToken = cookies.payload_invite
  if (!inviteCookieToken) {
    return send(res, 400, { message: 'Could not find payload_invite cookie' })
  }
  // verify cookie with invite service client -- returns email address
  let email
  try {
    const { email: tokenEmail } = await inviteServiceClient.call(
      'verifyInviteCookieToken',
      {
        inviteCookieToken,
      },
    )
    email = tokenEmail
  } catch (error) {
    return send(res, 400, { message: 'Invalid inviteCookieToken' })
  }

  // make a call to getInviteStatus to get position before and after
  try {
    const { before, after } = await inviteServiceClient.call(
      'getInviteStatus',
      {
        email,
      },
    )
    // return status
    send(res, 200, { before, after })
  } catch (error) {
    return send(res, 400, { message: 'Could not get invite status' })
  }
}
