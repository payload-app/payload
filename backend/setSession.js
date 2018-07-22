const { send } = require('micro')
const { parse } = require('cookie')
const RPCClient = require('@hharnisc/micro-rpc-client')
const userServiceClient = new RPCClient({
  url: 'http://user-service:3000/rpc',
})
const sessionServiceClient = new RPCClient({
  url: 'http://session-service:3000/rpc',
})

module.exports = next => async (req, res) => {
  const cookies = parse((req.headers && req.headers.cookie) || '')
  const token =
    cookies.impersonate_payload_session_token || cookies.payload_session_token
  if (token) {
    const { userId } = await sessionServiceClient.call('getSession', {
      token,
    })
    const user = await userServiceClient.call('getUser', {
      id: userId,
    })
    req.session = {
      user,
    }
  } else {
    return send(res, 401, { error: 'Unauthorized' })
  }

  await next(req, res)
}
