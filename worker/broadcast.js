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

module.exports = {
  broadcastStart,
  broadcastFail,
  broadcastComplete,
  broadcastRunError,
}
