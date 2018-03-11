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
  if (cookies.local_payload_session) {
    const { userId } = await sessionServiceClient.call('getSession', {
      token: cookies.local_payload_session,
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
