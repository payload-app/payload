const prettyBytes = require('pretty-bytes')
const RPCClient = require('@hharnisc/micro-rpc-client')
const statusBroadcasterClient = new RPCClient({
  url: 'http://status-broadcaster:3000/rpc',
})

const appRootUrl = `${process.env.APP_PROTOCOL}://${process.env.APP_HOST}`

const generateTargetUrl = ({ type, ownerType, owner, repo, branch, sha }) =>
  `${appRootUrl}/type/${encodeURIComponent(
    type,
  )}/ownertype/${encodeURIComponent(ownerType)}/owner/${encodeURIComponent(
    owner,
  )}/repo/${encodeURIComponent(repo)}/branch/${encodeURIComponent(
    branch,
  )}/sha/${encodeURIComponent(sha)}/`

const broadcastStart = async ({
  files,
  assetManifests,
  accessToken,
  type,
  ownerType,
  owner,
  repo,
  branch,
  sha,
}) => {
  await statusBroadcasterClient.call('broadcastStatus', {
    accessToken,
    owner,
    repo,
    sha,
    state: 'pending',
    description: 'Worker Calculating Payload...',
    context: `Payload`,
    targetUrl: generateTargetUrl({
      type,
      ownerType,
      owner,
      repo,
      branch,
      sha,
    }),
  })
  for (let file of files) {
    await statusBroadcasterClient.call('broadcastStatus', {
      accessToken,
      owner,
      repo,
      sha,
      state: 'pending',
      description: 'Pending...',
      context: `Payload - ${file}`,
      targetUrl: generateTargetUrl({
        type,
        ownerType,
        owner,
        repo,
        branch,
        sha,
      }),
    })
  }
  for (let assetManifest of assetManifests) {
    await statusBroadcasterClient.call('broadcastStatus', {
      accessToken,
      owner,
      repo,
      sha,
      state: 'pending',
      description: 'Pending...',
      context: `Payload - ${assetManifest}`,
      targetUrl: generateTargetUrl({
        type,
        ownerType,
        owner,
        repo,
        branch,
        sha,
      }),
    })
  }
}

const broadcastFail = async ({
  files,
  assetManifests,
  accessToken,
  type,
  ownerType,
  owner,
  repo,
  branch,
  sha,
  errorMessage,
}) => {
  await statusBroadcasterClient.call('broadcastStatus', {
    accessToken,
    owner,
    repo,
    sha,
    state: 'failure',
    description: errorMessage,
    context: `Payload`,
    targetUrl: generateTargetUrl({
      type,
      ownerType,
      owner,
      repo,
      branch,
      sha,
    }),
  })
  for (let file of files) {
    await statusBroadcasterClient.call('broadcastStatus', {
      accessToken,
      owner,
      repo,
      sha,
      state: 'failure',
      description: 'Run Failed',
      context: `Payload - ${file}`,
      targetUrl: generateTargetUrl({
        type,
        ownerType,
        owner,
        repo,
        branch,
        sha,
      }),
    })
  }
  for (let assetManifest of assetManifests) {
    await statusBroadcasterClient.call('broadcastStatus', {
      accessToken,
      owner,
      repo,
      sha,
      state: 'failure',
      description: 'Run Failed',
      context: `Payload - ${assetManifest}`,
      targetUrl: generateTargetUrl({
        type,
        ownerType,
        owner,
        repo,
        branch,
        sha,
      }),
    })
  }
}

const broadcastRunError = async ({
  accessToken,
  type,
  ownerType,
  owner,
  repo,
  branch,
  sha,
  errorMessage,
}) =>
  await statusBroadcasterClient.call('broadcastStatus', {
    accessToken,
    owner,
    repo,
    sha,
    state: 'failure',
    description: errorMessage,
    context: 'Payload',
    targetUrl: generateTargetUrl({ type, ownerType, owner, repo, branch, sha }),
  })

const broadcastComplete = async ({
  fileSizes,
  assetManifests,
  accessToken,
  type,
  ownerType,
  owner,
  repo,
  branch,
  sha,
}) => {
  await statusBroadcasterClient.call('broadcastStatus', {
    accessToken,
    owner,
    repo,
    sha,
    state: 'success',
    description: 'Complete',
    context: 'Payload',
    targetUrl: generateTargetUrl({
      type,
      ownerType,
      owner,
      repo,
      branch,
      sha,
    }),
  })
  for (let file of fileSizes) {
    await statusBroadcasterClient.call('broadcastStatus', {
      accessToken,
      owner,
      repo,
      sha,
      state: 'success',
      description: prettyBytes(file.size),
      context: `Payload - ${file.file}`,
      targetUrl: generateTargetUrl({
        type,
        ownerType,
        owner,
        repo,
        branch,
        sha,
      }),
    })
  }
  for (let assetManifest of assetManifests) {
    await statusBroadcasterClient.call('broadcastStatus', {
      accessToken,
      owner,
      repo,
      sha,
      state: 'success',
      description: 'Complete',
      context: `Payload - ${assetManifest}`,
      targetUrl: generateTargetUrl({
        type,
        ownerType,
        owner,
        repo,
        branch,
        sha,
      }),
    })
  }
}

const filesCollectionToObject = ({ collection }) =>
  collection.reduce((curObj, curItem) => {
    return {
      ...curObj,
      [curItem.file]: curItem.size,
    }
  }, {})

const broadcastCompleteWithDiffs = async ({
  baseFileSizes,
  headFileSizes,
  assetManifests,
  type,
  ownerType,
  owner,
  repo,
  branch,
  sha,
  accessToken,
  increaseThreshold = 0.05,
}) => {
  const objBaseFileSizes = filesCollectionToObject({
    collection: baseFileSizes,
  })
  const fileSizesWithDiffs = headFileSizes.map(headFile => {
    const baseFileSize = objBaseFileSizes[headFile.file]
    const headFileSize = headFile.size
    if (baseFileSize) {
      return {
        file: headFile.file,
        size: headFile.size,
        diff: (headFileSize - baseFileSize) / baseFileSize,
      }
    }
    return {
      file: headFile.file,
      size: headFile.size,
      diff: null,
    }
  })

  let topLevelState = 'success'
  for (let file of fileSizesWithDiffs) {
    let description = `${prettyBytes(file.size)}`
    let state = 'success'
    if (file.diff) {
      let diffArrow = ''
      if (file.diff > 0) {
        diffArrow = '↑ +'
      } else if (file.diff < 0) {
        diffArrow = '↓ '
      }
      description = `${description} (${diffArrow}${(file.diff * 100).toFixed(
        2,
      )}%)`
      state = file.diff > increaseThreshold ? 'failure' : 'success'
    }
    if (state === 'failure') {
      topLevelState = 'failure'
    }
    await statusBroadcasterClient.call('broadcastStatus', {
      accessToken,
      owner,
      repo,
      sha,
      state,
      description,
      context: `Payload - ${file.file}`,
      targetUrl: generateTargetUrl({
        type,
        ownerType,
        owner,
        repo,
        branch,
        sha,
      }),
    })
  }
  await statusBroadcasterClient.call('broadcastStatus', {
    accessToken,
    owner,
    repo,
    sha,
    state: topLevelState,
    description: topLevelState === 'failure' ? 'Failed' : 'Complete',
    context: 'Payload',
    targetUrl: generateTargetUrl({
      type,
      ownerType,
      owner,
      repo,
      branch,
      sha,
    }),
  })
  for (let assetManifest of assetManifests) {
    await statusBroadcasterClient.call('broadcastStatus', {
      accessToken,
      owner,
      repo,
      sha,
      state: topLevelState,
      description: topLevelState === 'failure' ? 'Failed' : 'Complete',
      context: `Payload - ${assetManifest}`,
      targetUrl: generateTargetUrl({
        type,
        ownerType,
        owner,
        repo,
        branch,
        sha,
      }),
    })
  }
}

module.exports = {
  broadcastStart,
  broadcastFail,
  broadcastComplete,
  broadcastCompleteWithDiffs,
  broadcastRunError,
}
