// @flow
import type { Repo } from 'api-types'
import React from 'react'
import ms from 'ms'
import TimeAgo from 'react-timeago'
import { Text, Button } from '../../../components'
import { red, mutedWhite } from '../../../components/style/color'

type Props = {
  repo: Repo,
  onActivateClick: () => {},
}

const datetimeToMS = ({ datetime }) => new Date(datetime).getTime()

const Duration = ({ start, stop }) => (
  <Text>
    Duration:{ms(
      Math.floor(
        datetimeToMS({ datetime: stop }) - datetimeToMS({ datetime: start }),
      ),
      {
        long: true,
      },
    )}
  </Text>
)

const CreateTime = ({ created }) => (
  <Text>Last Ran: {<TimeAgo date={created} />}</Text>
)

const SHA = ({ sha, branch }) => (
  <Text>
    SHA: {sha} Branch: {branch}
  </Text>
)

const ActiveContents = ({ repo }) => {
  if (repo.lastDefaultRun) {
    const { start, stop, created, sha, branch } = repo.lastDefaultRun
    return (
      <div>
        <SHA sha={sha} branch={branch} />
        <CreateTime created={created} />
        <Duration start={start} stop={stop} />
      </div>
    )
  } else {
    return <Text capitalize={true}>Active</Text>
  }
}

export default ({ repo, onActivateClick }: Props) => {
  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          borderTop: `1px solid ${mutedWhite}`,
          borderLeft: `1px solid ${mutedWhite}`,
          borderBottom: `1px solid ${mutedWhite}`,
          width: 9,
          marginTop: '1.5em',
          marginRight: 8,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex' }}>
          <Text size={2.4} capitalize={true}>
            {repo.owner}/{repo.repo}
          </Text>

          <div
            style={{
              flex: 1,
              borderTop: `1px solid ${mutedWhite}`,
              marginTop: '1.5em',
              marginLeft: 8,
            }}
          />
        </div>

        <div style={{ paddingTop: 10, paddingBottom: 20 }}>
          {repo.active ? (
            <div style={{ paddingTop: 1, paddingBottom: 2 }}>
              <ActiveContents repo={repo} />
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
        </div>
      </div>
      <div
        style={{
          borderTop: `1px solid ${mutedWhite}`,
          borderRight: `1px solid ${mutedWhite}`,
          width: 9,
          height: 9,
          marginTop: '1.5em',
          marginRight: 8,
        }}
      />
    </div>
  )
}
