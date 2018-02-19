const listRouteRegex = /^\/repos\/ownertype\/(\w+)\/ownerid\/(\w+)\//

export const getListRouteParams = ({ path }) => {
  const match = listRouteRegex.exec(path)
  if (match) {
    return {
      ownerType: match[1],
      ownerId: match[2],
    }
  }
  return null
}

export const generateListRoute = ({ ownerType, ownerId }) =>
  `/repos/ownertype/${ownerType}/ownerid/${ownerId}/`

export const listRoute = () =>
  generateListRoute({
    ownerType: ':ownerType',
    ownerId: ':ownerId',
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
