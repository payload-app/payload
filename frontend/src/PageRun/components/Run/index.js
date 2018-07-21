import React from 'react'
import ms from 'ms'
import TimeAgo from 'react-timeago'
import Page from '../../../Page'
import { Text, Pulse, AnimateText, FadeInChildren } from '../../../components'
import replace from 'react-string-replace'
import { red, mutedWhite, softLighten } from '../../../components/style/color'
import FileListViz from '../FileListViz'

const datetimeToMS = ({ datetime }) => new Date(datetime).getTime()
const formatDuration = ({ start, stop }) => {
  return ms(
    Math.floor(
      datetimeToMS({ datetime: stop }) - datetimeToMS({ datetime: start }),
    ),
    {
      long: true,
    },
  )
}

const mergeRunFilesWithPastRun = ({ files, prevFiles }) => {
  const prevFilesLookup = prevFiles.reduce((acc, { file, size }) => {
    acc[file] = { file, size }
    return acc
  }, {})
  return files.map(({ file: fileName, size }) => {
    const prevFile = prevFilesLookup[fileName] || {}
    return {
      fileName,
      size,
      prevSize: prevFile.size || 0,
    }
  })
}

const Heading = ({ children }) => (
  <div style={{ paddingBottom: 20 }}>
    <AnimateText size={2} capitalize color={mutedWhite}>
      {children}
    </AnimateText>
  </div>
)

const StatBlock = ({ number, label }) => (
  <div style={{ backgroundColor: softLighten, padding: 20, marginRight: 2 }}>
    <div>
      <Text size={2.4} weight={400} capitalize>
        {number}
      </Text>
    </div>

    <div>
      <Text color={mutedWhite}>{label}</Text>
    </div>
  </div>
)

const RunComponent = ({
  fileSizes,
  start,
  stop,
  created,
  recentDefaultBranchRuns,
}) => (
  <div>
    <Heading>Run Details</Heading>
    <div style={{ paddingBottom: 40, display: 'flex' }}>
      <FadeInChildren>
        <StatBlock
          number={
            stop ? formatDuration({ start, stop }) : <Pulse>In Progress</Pulse>
          }
          label={'Duration'}
        />
        <StatBlock
          number={<TimeAgo date={created} />}
          label={stop ? 'Date Ran' : 'Date Started'}
        />
      </FadeInChildren>
    </div>

    <Heading>Files Tracked</Heading>
    {fileSizes ? (
      <FileListViz
        files={mergeRunFilesWithPastRun({
          files: fileSizes,
          prevFiles: recentDefaultBranchRuns[0]
            ? recentDefaultBranchRuns[0].fileSizes
            : [],
        })}
      />
    ) : (
      <Text>Build Is In Progress...</Text>
    )}
  </div>
)

const ErrorDisplay = ({ errorMessage }) => (
  <div
    style={{
      display: 'flex',
      background: softLighten,
      borderLeft: `1px solid ${mutedWhite}`,
      padding: 20,
    }}
  >
    <div style={{ marginRight: '2rem' }}>
      <Text background={red}>Error</Text>
    </div>
    <div>
      <Text>
        {replace(errorMessage, /`([^`]+)`/g, code => (
          <Text background={mutedWhite} key={code}>
            {code}
          </Text>
        ))}
      </Text>
    </div>
  </div>
)

const LoadingDisplay = () => (
  <div style={{ marginRight: '2rem' }}>
    <Text>Loading...</Text>
  </div>
)

export default class extends React.Component {
  state = {
    runLoading: true,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loading && nextProps.loading === false) {
      setTimeout(() => this.setState({ runLoading: false }), 1000)
    }
  }

  render() {
    const { runLoading } = this.state
    const {
      loading,
      run: {
        fileSizes,
        start,
        stop,
        created,
        errorMessage,
        recentDefaultBranchRuns,
      },
    } = this.props

    return (
      <Page>
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          {!loading ? null : <LoadingDisplay />}
          {loading || runLoading || errorMessage ? null : (
            <RunComponent
              recentDefaultBranchRuns={recentDefaultBranchRuns}
              fileSizes={fileSizes}
              start={start}
              stop={stop}
              created={created}
            />
          )}
          {loading || !errorMessage || !stop ? null : (
            <ErrorDisplay errorMessage={errorMessage} />
          )}
        </div>
      </Page>
    )
  }
}
