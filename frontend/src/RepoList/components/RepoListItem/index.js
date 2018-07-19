import React from 'react'
import ms from 'ms'
import TimeAgo from 'react-timeago'
import { calculateDaysFromToday } from '../../utils'
import { Pulse, Text, Button, Link, Panel } from '../../../components'
import { red } from '../../../components/style/color'

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

const billingCustomerIsActive = ({ loading, trialEnd, paymentSourceSet }) =>
  loading === false &&
  (paymentSourceSet || calculateDaysFromToday({ date: trialEnd }) > 0.0)

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
        {stop ? (
          <Duration start={start} stop={stop} />
        ) : (
          <div style={{ flex: 1, textAlign: 'right' }}>
            <Pulse>
              <Text>Build Is In Progress...</Text>
            </Pulse>
          </div>
        )}
      </div>
    )
  } else {
    return <Text capitalize={true}>Active</Text>
  }
}

export default ({ repo, onActivateClick, onRunClick, billingCustomer }) => {
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
          {billingCustomer && billingCustomerIsActive(billingCustomer) ? (
            <Button onClick={onActivateClick} disabled={repo.activating}>
              {repo.activating ? 'Activating...' : 'Activate?'}
            </Button>
          ) : null}
        </div>
      )}
    </Panel>
  )
}
