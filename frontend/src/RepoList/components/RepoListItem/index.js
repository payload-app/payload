// @flow
import type { Repo } from 'api-types'
import React from 'react'
import ms from 'ms'
import TimeAgo from 'react-timeago'
import { Pulse, Text, Button, Link, Panel } from '../../../components'
import { red } from '../../../components/style/color'

type Props = {
  repo: Repo,
  onActivateClick: () => {},
}

const datetimeToMS = ({ datetime }) => new Date(datetime).getTime()

const Duration = ({ start, stop }) => (
  <div style={{ flex: 1, textAlign: 'right' }}>
    <Text>
      Duration:{' '}
      {ms(
        Math.floor(
          datetimeToMS({ datetime: stop }) - datetimeToMS({ datetime: start }),
        ),
        {
          long: true,
        },
      )}
    </Text>
  </div>
)

const CreateTime = ({ created }) => (
  <div style={{ flex: 1, textAlign: 'right' }}>
    <Text>Last Ran: {<TimeAgo date={created} />}</Text>
  </div>
)

const SHA = ({ branch, sha, errorMessage, onRunClick }) => (
  <div style={{ flex: 2 }}>
    <Text>{`${branch} » `}</Text>
    <Link
      onClick={e => {
        e.preventDefault()
        onRunClick()
      }}
    >
      {sha}
    </Link>
    {errorMessage ? (
      <div style={{ marginLeft: '0.5rem', display: 'inline-flex' }}>
        <Pulse>
          <Text>{`Error: ${errorMessage}`}</Text>
        </Pulse>
      </div>
    ) : null}
  </div>
)

const ActiveContents = ({ repo, onRunClick }) => {
  if (repo.lastDefaultRun) {
    const {
      start,
      stop,
      created,
      branch,
      sha,
      errorMessage,
    } = repo.lastDefaultRun
    return (
      <div style={{ display: 'flex' }}>
        <SHA
          sha={sha}
          branch={branch}
          errorMessage={errorMessage}
          onRunClick={onRunClick}
        />
        <CreateTime created={created} />
        <Duration start={start} stop={stop} />
      </div>
    )
  } else {
    return <Text capitalize={true}>Active</Text>
  }
}

export default ({ repo, onActivateClick, onRunClick }: Props) => {
  return (
    <Panel
      TitleComponent={
        <Text size={2.4} capitalize={true}>
          {repo.owner}/{repo.repo}
        </Text>
      }
    >
      {repo.active ? (
        <div style={{ paddingTop: 1, paddingBottom: 2 }}>
          <ActiveContents repo={repo} onRunClick={onRunClick} />
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text capitalize={true} background={red}>
            <span
              style={{
                display: 'inline-block', // HACK: Add Padding to Inline El
                paddingTop: 1,
                paddingLeft: 3,
                paddingRight: 3,
              }}
            >
              Not Active
            </span>
          </Text>

          <Button onClick={onActivateClick} disabled={repo.activating}>
            {repo.activating ? 'Activating...' : 'Activate?'}
          </Button>
        </div>
      )}
    </Panel>
  )
}
