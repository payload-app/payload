// const listRouteRegex = /^\/repos\/ownertype\/(\w+)\/ownerid\/(\w+)\//
const listRouteRegex = /^\/type\/(\w+)\/ownertype\/(\w+)\/owner\/(\w+)/

export const getListRouteParams = ({ path }) => {
  const match = listRouteRegex.exec(path)
  if (match) {
    return {
      type: match[1],
      ownerType: match[2],
      owner: match[3],
    }
  }
  return null
}

export const generateListRoute = ({ type, ownerType, owner }) =>
  `/type/${type}/ownertype/${ownerType}/owner/${owner}/`

export const listRoute = () =>
  generateListRoute({
    type: ':type',
    ownerType: ':ownerType',
    owner: ':owner',
  })

const runRouteRegex = /^\/runs\/(\w+)\//

export const getRunRouteParams = ({ path }) => {
  const match = runRouteRegex.exec(path)
  if (match) {
    return {
      runId: match[1],
    }
  }
  return null
}

export const generateRunRoute = ({ runId }) => `/runs/${runId}/`

export const runRoute = () =>
  generateRunRoute({
    runId: ':runId',
  })

export const baseRoute = () => '/'

export const authRoute = () => '/auth/'

export const routes = {
  BASE: 'BASE',
  AUTH: 'AUTH',
  RUNS: 'RUNS',
  REPO_LIST: 'REPO_LIST',
}

export const matchRoute = ({ path }) => {
  if (path === baseRoute()) {
    return {
      route: routes.BASE,
      params: {},
    }
  }
  if (path === authRoute()) {
    return {
      route: routes.AUTH,
      params: {},
    }
  }
  let params = getRunRouteParams({ path })
  if (params) {
    return {
      route: routes.RUNS,
      params,
    }
  }
  params = getListRouteParams({ path })
  if (params) {
    return {
      route: routes.REPO_LIST,
      params,
    }
  }
  return null
}
