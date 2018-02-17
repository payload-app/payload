const getRepos = async ({
  name,
  ownerType,
  githubServiceClient,
  accessToken,
}) => {
  const path =
    ownerType === 'user' ? `/users/${name}/repos` : `/orgs/${name}/repos`
  const pages = await githubServiceClient.call('allPagesGithubRequest', {
    path: path,
    pageSize: 100,
    accessToken: accessToken,
  })
  pages.forEach(page => {
    if (page.status !== 200) {
      throw new Error('there was an error fetching user orgs')
    }
  })
  return pages.reduce((pageArgs, page) => {
    const onePageArgs = page.data.map(data => ({
      repo: data.name,
      active: false,
    }))
    return [...pageArgs, ...onePageArgs]
  }, [])
}

const createRepos = async ({
  repoServiceClient,
  repos,
  owner,
  ownerType,
  type,
  userId,
}) => {
  return await repoServiceClient.call('createRepos', {
    repos,
    owner,
    ownerType,
    type,
    userId,
  })
}

module.exports = async ({
  githubServiceClient,
  repoServiceClient,
  accessToken,
  organizations,
  user,
  userId,
}) => {
  const repos = await getRepos({
    name: user.username,
    ownerType: 'user',
    githubServiceClient,
    accessToken,
  })
  await createRepos({
    repoServiceClient,
    repos,
    owner: user.username,
    ownerType: 'user',
    type: 'github',
    userId,
  })
  for (let org of organizations) {
    const repos = await getRepos({
      name: org.name,
      ownerType: 'organization',
      githubServiceClient,
      accessToken,
    })
    await createRepos({
      repoServiceClient,
      owner: org.name,
      repos,
      ownerType: 'organization',
      type: 'github',
      userId,
    })
  }
}
