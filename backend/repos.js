const { parseGithubTokenFromSession } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const parseRepos = ({ repos, name }) =>
  repos.map(repo => ({
    owner: name,
    repo: repo.name,
  }))

module.exports = ({ githubServiceClient }) => async (
  { name, ownerType },
  { session },
) => {
  // this is the singular version of this request
  // the paged version is allPagesGithubRequest
  if (ownerType === 'user') {
    const { status, data: repos } = await githubServiceClient.call(
      'githubRequest',
      {
        path: `/users/${name}/repos`,
        accessToken: parseGithubTokenFromSession({ session }),
      },
    )
    if (status !== 200) {
      throw createError({
        message: 'could not fetch user repos',
      })
    }
    return parseRepos({ repos, name })
  } else {
    const { status, data: repos } = await githubServiceClient.call(
      'githubRequest',
      {
        path: `/orgs/${name}/repos`,
        accessToken: parseGithubTokenFromSession({ session }),
      },
    )
    if (status !== 200) {
      throw createError({
        message: 'could not fetch organization repos',
      })
    }
    return parseRepos({ repos, name })
  }
}
