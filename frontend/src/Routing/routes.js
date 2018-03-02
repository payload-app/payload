const listRoutePattern = '^/type/([\\w-]+)/ownertype/([\\w-]+)/owner/([\\w-]+)/'
const listRouteRegex = new RegExp(listRoutePattern)

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

const runRoutePattern = `${listRoutePattern}repo/([\\w-]+)/branch/([\\w-]+)/sha/([\\w-]+)/`
const runRouteRegex = new RegExp(runRoutePattern)

export const getRunRouteParams = ({ path }) => {
  const match = runRouteRegex.exec(path)
  if (match) {
    return {
      type: match[1],
      ownerType: match[2],
      owner: match[3],
      repo: match[4],
      branch: match[5],
      sha: match[6],
    }
  }
  return null
}

export const generateRunRoute = ({
  type,
  ownerType,
  owner,
  repo,
  branch,
  sha,
}) =>
  `${generateListRoute({
    type,
    ownerType,
    owner,
  })}repo/${repo}/branch/${branch}/sha/${sha}/`

export const runRoute = () =>
  generateRunRoute({
    type: ':type',
    ownerType: ':ownerType',
    owner: ':owner',
    repo: ':repo',
    branch: ':branch',
    sha: ':sha',
  })

export const baseRoute = () => '/'
export const authRoute = () => '/auth/'
export const initRoute = () => '/init/'

export const routes = {
  BASE: 'BASE',
  AUTH: 'AUTH',
  RUNS: 'RUNS',
  REPO_LIST: 'REPO_LIST',
  INIT: 'INIT',
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
  if (path === initRoute()) {
    return {
      route: routes.INIT,
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
