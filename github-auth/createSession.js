const cookie = require('cookie')
const ms = require('ms')
const RPCClient = require('@hharnisc/micro-rpc-client')
const axios = require('axios')

const githubApiUrl = process.env.GH_API_HOST || 'https://api.github.com'
const userServiceClient = new RPCClient({
  url: 'http://user-service:3000/rpc',
})
const sessionServiceClient = new RPCClient({
  url: 'http://session-service:3000/rpc',
})

module.exports = async ({ accessToken, res }) => {
  const { status, data } = await axios({
    method: 'GET',
    url: `${githubApiUrl}/user`,
    responseType: 'json',
    headers: {
      'User-Agent': 'Payload',
      Authorization: `token ${accessToken}`,
    },
  })
  if (status !== 200) {
    throw new Error('Could not get user from github')
  }
  const user = {
    avatar: data.avatar_url,
    username: data.login,
    name: data.name,
    accessToken,
    email: data.email,
    type: 'github',
  }
  let userId
  try {
    const { _id } = await userServiceClient.call('updateUserAccount', user)
    userId = _id
  } catch (err) {
    if (err.message !== `Could not update user with email ${data.email}`) {
      throw err
    }
  }
  if (!userId) {
    const { id } = await userServiceClient.call('createUser', user)
    userId = id
  }
  const token = await sessionServiceClient.call('createSession', {
    userId,
  })
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('local_payload_session', token, {
      httpOnly: true,
      maxAge: ms('30 days') / 1000,
      domain: '.local.payloadapp.com',
    }),
  )
}
