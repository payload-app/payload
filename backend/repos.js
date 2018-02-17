module.exports = ({ repoServiceClient }) => async ({ name, ownerType }) =>
  await repoServiceClient.call('getOwnerRepos', {
    owner: name,
    ownerType,
  })
