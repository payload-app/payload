// @flow
const rp = require('request-promise')
const { createError } = require('@hharnisc/micro-rpc')

const GITHUB_URL = 'https://api.github.com/'

type GithubApiCall = {
  method?: string,
  endpoint: string,
  token: string,
}

const githubApiCall = ({
  method,
  endpoint,
  token,
}: GithubApiCall): Promise<*> =>
  rp({
    method: method || 'GET',
    url: `${GITHUB_URL}${endpoint}`,
    headers: {
      'User-Agent': 'Payload',
      Authorization: `token ${token}`,
    },
  })
    .then(data => JSON.parse(data))
    .catch(({ error, statusCode }) =>
      createError({
        message: error,
        statusCode,
      }),
    )

module.exports = {
  githubApiCall,
}
