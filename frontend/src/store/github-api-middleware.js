// @flow
import request from 'request'

export const GITHUB_API = 'GITHUB_API'

export const status = {
  REQUEST: 'request',
  SUCCESS: 'success',
  FAILURE: 'failure',
}

type Middleware = () => any => any => any

type Config = {
  baseUrl?: string,
  apiKey?: string,
}

export type GithubAction = {
  method?: 'GET',
  type: 'string',
  endpoint: 'string',
  transform?: any => any,
}

let token

export const middleware = ({
  baseUrl = 'https://api.github.com/',
}: Config = {}) => {
  return (() => next => action => {
    const apiAction = action[GITHUB_API]
    if (apiAction) {
      const {
        method = 'GET',
        type,
        endpoint,
        transform = body => ({ body }),
      }: GithubAction = apiAction

      next({ type, status: status.REQUEST })

      request(
        {
          method,
          url: `${baseUrl}${endpoint}?access_token=${token}`,
        },
        (error, { statusCode }, body) => {
          if (statusCode !== 200) {
            next({ type, statusCode, status: status.FAILURE })
          } else {
            next({
              type,
              ...transform(JSON.parse(body)),
              status: status.SUCCESS,
            })
          }
        },
      )
    } else {
      next(action)
    }
  }: Middleware)
}

export const getTokenFromUrl = (url: string): Promise<*> =>
  new Promise(resolve => {
    const params = new URLSearchParams(url)
    token = params.get('access_token')
    params.delete('access_token')
    if (token) {
      resolve(token)
    } else {
      // reject()
    }
  })
