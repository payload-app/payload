import React from 'react'
import prettyBytes from 'pretty-bytes'
import ms from 'ms'
import TimeAgo from 'react-timeago'
import Header from '../../../Header'
import { Text } from '../../../components'
import { red } from '../../../components/style/color'

const FileSizes = ({ fileSizes }) => (
  <div>
    <div>
      <Text size={1.5}>Build Size</Text>
    </div>
    {fileSizes.map(({ file, size }) => (
      <div key={file} style={{ display: 'flex' }}>
        <div
          style={{
            marginRight: '0.5rem',
          }}
        >
          <Text>{file}</Text>
        </div>
        <div>
          <Text weight={600}>{prettyBytes(size)}</Text>
        </div>
      </div>
    ))}
  </div>
)

const datetimeToMS = ({ datetime }) => new Date(datetime).getTime()

const Duration = ({ start, stop }) => (
  <div style={{ display: 'flex' }}>
    <div
      style={{
        marginRight: '0.5rem',
      }}
    >
      <Text>Duration:</Text>
    </div>
    <div>
      <Text weight={600}>
        {ms(
          Math.floor(
            datetimeToMS({ datetime: stop }) / 1000 -
              datetimeToMS({ datetime: start }) / 1000,
          ),
          {
            long: true,
          },
        )}
      </Text>
    </div>
  </div>
)

const CreateTime = ({ created }) => (
  <div style={{ display: 'flex' }}>
    <div
      style={{
        marginRight: '0.5rem',
      }}
    >
      <Text>Ran:</Text>
    </div>
    <div>
      <Text weight={600}>{<TimeAgo date={created} />}</Text>
    </div>
  </div>
)

const RunComponent = ({ fileSizes, start, stop, created }) => (
  <div>
    <FileSizes fileSizes={fileSizes} />
    <div>
      <Text size={1.5}>Details</Text>
    </div>
    <Duration start={start} stop={stop} />
    <CreateTime created={created} />
  </div>
)

const ErrorDisplay = ({ errorMessage }) => (
  <div
    style={{
      display: 'flex',
    }}
  >
    <div style={{ marginRight: '0.5rem' }}>
      <Text background={red}>Error</Text>
    </div>
    <div>
      <Text>{errorMessage}</Text>
    </div>
  </div>
)

export default ({
  loading,
  run: { fileSizes, start, stop, created, errorMessage },
}) => (
  <div>
    <Header />
    {loading || errorMessage ? null : (
      <RunComponent
        fileSizes={fileSizes}
        start={start}
        stop={stop}
        created={created}
      />
    )}
    {loading || !errorMessage ? null : (
      <ErrorDisplay errorMessage={errorMessage} />
    )}
  </div>
)
