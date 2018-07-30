const acceptOrCreateInvite = require('./acceptOrCreateInvite')

module.exports = async ({
  userServiceClient,
  githubServiceClient,
  billingServiceClient,
  inviteServiceClient,
  randomStateMetadata,
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
  // TODO: could inject super user status here
  if (!userId) {
    const { id } = await userServiceClient.call('createUser', user)
    userId = id
    created = true
  }

  const { invited } = await acceptOrCreateInvite({
    randomStateMetadata,
    userId,
    email: data.email,
    inviteServiceClient,
  })

  if (!invited) {
    try {
      await billingServiceClient.call('startTrial', {
        ownerId: userId,
        ownerType: 'user',
        userId,
      })
    } catch (error) {
      // if not a duplicate key error -- rethrow the error
      if (!error.message.includes('E11000')) {
        throw error
      }
    }
  }
  return {
    userId,
    created,
    invited,
    userEmail: data.email,
  }
}
