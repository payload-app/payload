module.exports = async ({
  randomStateMetadata, // metadata of invite to claim
  userId, // user who we check for existing invite
  email, // email to create an invite for
  inviteServiceClient,
}) => {
  const { email: emailMetadata, inviteToken } = randomStateMetadata || {}
  let invited = false
  let acceptedInvite = false
  if (inviteToken && emailMetadata) {
    // try to accept the invite
    try {
      await inviteServiceClient.call('accept', {
        email: emailMetadata,
        userId,
        inviteToken,
      })
      acceptedInvite = true
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
          email,
        })
      } catch (error) {
        // if not a duplicate key error -- rethrow the error
        if (!error.message.includes('E11000')) {
          throw error
        }
      }
    }
  }
  return {
    invited,
    acceptedInvite,
  }
}
