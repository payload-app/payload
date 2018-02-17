const { parseGithubTokenFromSession } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

module.exports = ({ githubServiceClient }) => async (_, { session }) => {
  // this is the singular version of this request
  // the paged version is allPagesGithubRequest
  const { status, data } = await githubServiceClient.call('githubRequest', {
    path: '/user/repos',
    accessToken: parseGithubTokenFromSession({ session }),
  })
  if (status !== 200) {
    throw createError({
      message: 'could not fetch user repos',
    })
  }
  return data
}
