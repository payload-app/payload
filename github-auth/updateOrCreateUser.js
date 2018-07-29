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

  const { email: emailMetadata, inviteToken } = randomStateMetadata || {}
  let invited = false
  if (inviteToken && emailMetadata) {
    // try to accept the invite
    try {
      await inviteServiceClient.call('accept', {
        email: emailMetadata,
        userId,
        inviteToken,
      })
    } catch (error) {
      if (error.message.includes('has already accepted an invite')) {
        throw new Error('The invite token has already been claimed')
      }
      throw new Error('There was an issue claiming the invite token')
    }
  } else {
    // if the user has not accepted an invite, invite them
    if (!await inviteServiceClient.call('userHasAcceptedInvite', { userId })) {
      invited = true
      try {
        await inviteServiceClient.call('create', {
          email: data.email,
        })
      } catch (error) {
        // if not a duplicate key error -- rethrow the error
        if (!error.message.includes('E11000')) {
          throw error
        }
      }
    }
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
  }
}
