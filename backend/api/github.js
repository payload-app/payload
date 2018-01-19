// @flow
const request = require('request')
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
}: GithubApiCall): Promise<*> => {
  return new Promise((resolve, reject) => {
    request(
      {
        method: method || 'GET',
        url: `${GITHUB_URL}${endpoint}`,
        headers: {
          'User-Agent': 'Payload',
          Authorization: `token ${token}`,
        },
      },
      (error, { statusCode }, body) => {
        if (statusCode !== 200 || error) {
          reject(
            createError({
              message: error,
              statusCode,
            }),
          )
        } else {
          resolve(JSON.parse(body))
        }
      },
    )
  })
}

module.exports = {
  githubApiCall,
}
