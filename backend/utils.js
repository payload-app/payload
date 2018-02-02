const parseGithubTokenFromSession = ({ session }) => {
  if (session) {
    return session.user.accounts.github.accessToken
  }
}
module.exports = {
  parseGithubTokenFromSession,
}
