const acceptOrCreateInvite = require('./acceptOrCreateInvite')

module.exports = async ({
  userServiceClient,
  githubServiceClient,
  billingServiceClient,
  inviteServiceClient,
  randomStateMetadata,
  admins,
  accessToken,
}) => {
  const { status, data } = await githubServiceClient.call('githubRequest', {
    path: '/user',
    accessToken,
  })
  if (status !== 200) {
    throw new Error('Could not get user from github')
  }
  const isSuperUser = admins.includes(data.email)
  const user = {
    avatar: data.avatar_url,
    username: data.login,
    name: data.name,
    accessToken,
    email: data.email,
    superUser: isSuperUser,
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

  let invited = false
  if (!isSuperUser) {
    const { invited: userInvited } = await acceptOrCreateInvite({
      randomStateMetadata,
      userId,
      email: data.email,
      inviteServiceClient,
    })
    invited = userInvited
  }
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
