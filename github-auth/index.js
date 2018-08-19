require('dotenv').config()
const { readFile } = require('fs')
const { promisify } = require('util')
const querystring = require('querystring')
const axios = require('axios')
const { router, get } = require('microrouter')
const redirect = require('micro-redirect')
const RPCClient = require('@hharnisc/micro-rpc-client')
const createSession = require('./createSession')

const readFilePromise = promisify(readFile)

const appHost = process.env.APP_HOST
const appRootUrl = `${process.env.APP_PROTOCOL}://${appHost}`
const cookieDomain = process.env.COOKIE_DOMAIN

const githubUrl = process.env.GH_HOST || 'github.com'

const githubServiceClient = new RPCClient({
  url: 'http://github-service:3000/rpc',
})
const userServiceClient = new RPCClient({
  url: 'http://user-service:3000/rpc',
})
const sessionServiceClient = new RPCClient({
  url: 'http://session-service:3000/rpc',
})
const randomStateServiceClient = new RPCClient({
  url: 'http://random-state-service:3000/rpc',
})
const billingServiceClient = new RPCClient({
  url: 'http://billing-service:3000/rpc',
})
const inviteServiceClient = new RPCClient({
  url: 'http://invite-service:3000/rpc',
})

const init = async handler => {
  const admins = JSON.parse(await readFilePromise('admins.json'))
  return handler({ admins })
}

const redirectWithQueryString = (res, data) => {
  const location = `${appRootUrl}/auth/?${querystring.stringify(data)}`
  redirect(res, 302, location)
}

const login = async (req, res) => {
  const { email, inviteToken } = req.query
  const { state } = await randomStateServiceClient.call('createState', {
    metadata: { email, inviteToken },
  })
  redirect(
    res,
    302,
    `https://${githubUrl}/login/oauth/authorize?client_id=${
      process.env.GH_CLIENT_ID
    }&state=${state}&scope=repo`,
  )
}

const callback = ({ admins }) => async (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  const { code, state } = req.query
  if (!code && !state) {
    console.error('Missing code or state')
    return redirectWithQueryString(res, {
      errorCode: '1000',
    })
  } else {
    const {
      valid,
      metadata: randomStateMetadata,
    } = await randomStateServiceClient.call('validateState', {
      state,
    })
    if (!valid) {
      console.error('Unknown state')
      return redirectWithQueryString(res, {
        errorCode: '1000',
      })
    }
    await randomStateServiceClient.call('deleteState', {
      state,
    })
    try {
      const { status, data } = await axios({
        method: 'POST',
        url: `https://${githubUrl}/login/oauth/access_token`,
        responseType: 'json',
        data: {
          client_id: process.env.GH_CLIENT_ID,
          client_secret: process.env.GH_CLIENT_SECRET,
          code,
        },
      })

      if (status === 200) {
        const qs = querystring.parse(data)
        if (qs.error) {
          // failed to authenticate
          console.error('qs.error_description', qs.error_description)
          redirectWithQueryString(res, {
            errorCode: '1001',
          })
        } else {
          const { created, invited, acceptedInvite } = await createSession({
            userServiceClient,
            sessionServiceClient,
            githubServiceClient,
            billingServiceClient,
            inviteServiceClient,
            accessToken: qs.access_token,
            randomStateMetadata,
            admins,
            res,
            cookieDomain,
          })
          if (invited) {
            redirect(res, 302, `${appRootUrl}/invited/`)
          } else {
            redirect(
              res,
              302,
              `${appRootUrl}${created || acceptedInvite ? '/init/' : ''}`,
            )
          }
        }
      } else {
        // Error with github
        console.error('There was an error with Github servers')
        redirectWithQueryString(res, { errorCode: '1002' })
      }
    } catch (err) {
      console.error('err.message', err.message)
      console.error('err.stack', err.stack)
      // unexpected error
      redirectWithQueryString(res, {
        errorCode: '1000',
      })
    }
  }
}

const healthHandler = () => 'OK'

module.exports = init(({ admins }) =>
  router(
    get('/', healthHandler),
    get('/healthz', healthHandler),
    get('/login', login),
    get('/callback', callback({ admins })),
  ),
)
