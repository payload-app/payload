module.exports = async ({
  userServiceClient,
  githubServiceClient,
  accessToken,
}) => {
  const { status, data } = await githubServiceClient.call('githubRequest', {
    path: '/user',
    accessToken,
  })
  if (status !== 200) {
    throw new Error('Could not get user from github')
  }
  const user = {
    avatar: data.avatar_url,
    username: data.login,
    name: data.name,
    accessToken,
    email: data.email,
    type: 'github',
  }
  let userId
  let created = false
  try {
    const { _id } = await userServiceClient.call('updateAccount', user)
    userId = _id
  } catch (err) {
    if (err.message !== `Could not update user with email ${data.email}`) {
      throw err
    }
  }
  if (!userId) {
    const { id } = await userServiceClient.call('createUser', user)
    userId = id
    created = true
  }
  return {
    userId,
    created,
    user,
  }
}
