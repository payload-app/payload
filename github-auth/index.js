require('dotenv').config()
const querystring = require('querystring')
const axios = require('axios')
const { router, get } = require('microrouter')
const redirect = require('micro-redirect')
const uid = require('uid-promise')
const RPCClient = require('@hharnisc/micro-rpc-client')
const createSession = require('./createSession')

const githubUrl = process.env.GH_HOST || 'github.com'

const states = [] // TODO: Move to data somewhere

const githubServiceClient = new RPCClient({
  url: 'http://github-service:3000/rpc',
})
const userServiceClient = new RPCClient({
  url: 'http://user-service:3000/rpc',
})
const organizationServiceClient = new RPCClient({
  url: 'http://organization-service:3000/rpc',
})
const sessionServiceClient = new RPCClient({
  url: 'http://session-service:3000/rpc',
})

const redirectWithQueryString = (res, data) => {
  const location = `${process.env.REDIRECT_URL}?${querystring.stringify(data)}`
  redirect(res, 302, location)
}

const login = async (req, res) => {
  const state = await uid(20)
  states.push(state)
  redirect(
    res,
    302,
    `https://${githubUrl}/login/oauth/authorize?client_id=${
      process.env.GH_CLIENT_ID
    }&state=${state}&scope=repo`,
  )
}

// TODO: redirect to error page to display error message
const callback = async (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  const { code, state } = req.query
  if (!code && !state) {
    redirectWithQueryString(res, {
      error: 'Provide code and state query param',
    })
  } else if (!states.includes(state)) {
    redirectWithQueryString(res, { error: 'Unknown state' })
  } else {
    states.splice(states.indexOf(state), 1)
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
          redirectWithQueryString(res, { error: qs.error_description })
        } else {
          await createSession({
            userServiceClient,
            organizationServiceClient,
            sessionServiceClient,
            githubServiceClient,
            accessToken: qs.access_token,
            res,
          })
          redirect(res, 302, process.env.REDIRECT_URL)
        }
      } else {
        redirectWithQueryString(res, { error: 'GitHub server error.' })
      }
    } catch (err) {
      redirectWithQueryString(res, {
        error: err.message,
      })
    }
  }
}

module.exports = router(get('/login', login), get('/callback', callback))
