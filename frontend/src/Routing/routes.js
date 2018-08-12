import { parse } from 'qs'

const urlString = ({ string, encoded }) =>
  encoded ? encodeURIComponent(string) : string

const urlParam = ({ param, decoded }) =>
  decoded ? decodeURIComponent(param) : param

const listRoutePattern =
  '^/type/([\\w-/%]+)/ownertype/([\\w-/%]+)/owner/([\\w-/%]+)/'
const listRouteRegex = new RegExp(listRoutePattern)

export const getListRouteParams = ({ path, decoded = true }) => {
  const match = listRouteRegex.exec(path)
  if (match) {
    return {
      type: urlParam({ param: match[1], decoded }),
      ownerType: urlParam({ param: match[2], decoded }),
      owner: urlParam({ param: match[3], decoded }),
    }
  }
  return null
}

export const generateListRoute = ({ type, ownerType, owner, encoded = true }) =>
  `/type/${urlString({
    string: type,
    encoded,
  })}/ownertype/${urlString({ string: ownerType, encoded })}/owner/${urlString({
    string: owner,
    encoded,
  })}/`

export const listRoute = () =>
  generateListRoute({
    type: ':type',
    ownerType: ':ownerType',
    owner: ':owner',
    encoded: false,
  })

const ownerSettingsRoutePattern = `${listRoutePattern}settings/([\\w-]+)/`
const ownerSettingsRouteRegex = new RegExp(ownerSettingsRoutePattern)

export const getOwnerSettingsRouteParams = ({ path, decoded = true }) => {
  const match = ownerSettingsRouteRegex.exec(path)
  if (match) {
    return {
      type: urlParam({ param: match[1], decoded }),
      ownerType: urlParam({ param: match[2], decoded }),
      owner: urlParam({ param: match[3], decoded }),
      settingsType: urlParam({ param: match[4], decoded }),
    }
  }
  return null
}

export const generateOwnerSettingsRoute = ({
  type,
  ownerType,
  owner,
  settingsType,
  encoded = true,
}) =>
  `/type/${urlString({ string: type, encoded })}/ownertype/${urlString({
    string: ownerType,
    encoded,
  })}/owner/${urlString({ string: owner, encoded })}/settings/${urlString({
    string: settingsType,
    encoded,
  })}/`

export const ownerSettingsRoute = () =>
  generateOwnerSettingsRoute({
    type: ':type',
    ownerType: ':ownerType',
    owner: ':owner',
    settingsType: ':settingsType',
    encoded: false,
  })

const runRoutePattern = `${listRoutePattern}repo/([\\w-/%]+)/branch/([\\w-/%]+)/sha/([\\w-]+)/`
const runRouteRegex = new RegExp(runRoutePattern)

export const getRunRouteParams = ({ path, decoded = true }) => {
  const match = runRouteRegex.exec(path)
  if (match) {
    return {
      type: urlParam({ param: match[1], decoded }),
      ownerType: urlParam({ param: match[2], decoded }),
      owner: urlParam({ param: match[3], decoded }),
      repo: urlParam({ param: match[4], decoded }),
      branch: urlParam({ param: match[5], decoded }),
      sha: urlParam({ param: match[6], decoded }),
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
  encoded = true,
}) =>
  `${generateListRoute({
    type,
    ownerType,
    owner,
    encoded,
  })}repo/${urlString({ string: repo, encoded })}/branch/${urlString({
    string: branch,
    encoded,
  })}/sha/${urlString({ string: sha, encoded })}/`

export const runRoute = () =>
  generateRunRoute({
    type: ':type',
    ownerType: ':ownerType',
    owner: ':owner',
    repo: ':repo',
    branch: ':branch',
    sha: ':sha',
    encoded: false,
  })

export const baseRoute = () => '/'
export const authRoute = () => '/auth/'
export const initRoute = () => '/init/'
export const invitedRoute = () => '/invited/'

export const routes = {
  BASE: 'BASE',
  AUTH: 'AUTH',
  RUNS: 'RUNS',
  REPO_LIST: 'REPO_LIST',
  OWNER_SETTINGS: 'OWNER_SETTINGS',
  INIT: 'INIT',
  INVITED: 'INVITED',
}

export const matchRoute = ({ path, search }) => {
  if (path === invitedRoute()) {
    return {
      route: routes.INVITED,
      params: {},
    }
  }
  if (path === baseRoute()) {
    return {
      route: routes.BASE,
      params: {},
    }
  }
  if (path === authRoute()) {
    const { email, inviteToken, errorCode } = parse(search)
    return {
      route: routes.AUTH,
      params: {
        email,
        inviteToken,
        errorCode,
      },
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
  params = getOwnerSettingsRouteParams({ path })
  if (params) {
    return {
      route: routes.OWNER_SETTINGS,
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
