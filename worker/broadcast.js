const prettyBytes = require('pretty-bytes')
const RPCClient = require('@hharnisc/micro-rpc-client')
const statusBroadcasterClient = new RPCClient({
  url: 'http://status-broadcaster:3000/rpc',
})

// TODO: add targetUrl to each of these

const broadcastStart = async ({ files, accessToken, owner, repo, sha }) => {
  for (let file of files) {
    await statusBroadcasterClient.call('broadcastStatus', {
      accessToken,
      owner,
      repo,
      sha,
      state: 'pending',
      description: 'Pending...',
      context: `Payload - ${file}`,
    })
  }
}

const broadcastFail = async ({ files, accessToken, owner, repo, sha }) => {
  for (let file of files) {
    await statusBroadcasterClient.call('broadcastStatus', {
      accessToken,
      owner,
      repo,
      sha,
      state: 'failure',
      description: 'Run Failed',
      context: `Payload - ${file}`,
    })
  }
}

const broadcastRunError = async ({ accessToken, owner, repo, sha }) =>
  await statusBroadcasterClient.call('broadcastStatus', {
    accessToken,
    owner,
    repo,
    sha,
    state: 'failure',
    description: 'Payload Run Error',
    context: 'Payload',
  })

const broadcastComplete = async ({
  fileSizes,
  accessToken,
  owner,
  repo,
  sha,
}) => {
  for (let file of fileSizes) {
    await statusBroadcasterClient.call('broadcastStatus', {
      accessToken,
      owner,
      repo,
      sha,
      state: 'success',
      description: prettyBytes(file.size),
      context: `Payload - ${file.file}`,
    })
  }
}

const filesCollectionToObject = ({ collection }) =>
  collection.reduce((curObj, curItem) => {
    return {
      curObj,
      [curItem.file]: curItem.size,
    }
  }, {})

const broadcastCompleteWithDiffs = async ({
  baseFileSizes,
  headFileSizes,
  owner,
  repo,
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

  for (let file of fileSizesWithDiffs) {
    let description = `${prettyBytes(file.size)}`
    let state = 'success'
    if (file.diff) {
      description = `${description} (${file > 0 ? '+' : ''}${(
        file.diff * 100
      ).toFixed(2)}%)`
      state = file.diff > increaseThreshold ? 'failure' : 'success'
    }
    await statusBroadcasterClient.call('broadcastStatus', {
      accessToken,
      owner,
      repo,
      sha,
      state,
      description,
      context: `Payload - ${file.file}`,
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
