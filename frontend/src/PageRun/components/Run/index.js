import React from 'react'
import prettyBytes from 'pretty-bytes'
import ms from 'ms'
import TimeAgo from 'react-timeago'
import Page from '../../../Page'
import { Text } from '../../../components'
import replace from 'react-string-replace'
import { red, mutedWhite, softLighten } from '../../../components/style/color'
import FileSizeChart from '../FileSizeChart'
import { FileListViz } from '../FileListViz'

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
            datetimeToMS({ datetime: stop }) -
              datetimeToMS({ datetime: start }),
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

const mergeRunFilesWithPastRun = ({ files, prevFiles }) => {
  const prevFilesLookup = prevFiles.reduce((acc, { file, size }) => {
    acc[file] = { file, size }
    return acc
  }, {})
  console.log(prevFilesLookup)
  return files.map(({ file: fileName, size }) => {
    const prevFile = prevFilesLookup[fileName] || {}
    return {
      fileName,
      size,
      prevSize: prevFile.size || 0,
    }
  })
}

const RunComponent = ({
  fileSizes,
  start,
  stop,
  created,
  recentDefaultBranchRuns,
}) => (
  <div>
    <FileListViz
      files={mergeRunFilesWithPastRun({
        files: fileSizes,
        prevFiles: recentDefaultBranchRuns[0]
          ? recentDefaultBranchRuns[0].fileSizes
          : [],
      })}
    />
    <br />
    <br />
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

const parseRecentFileSizes = ({ recentDefaultBranchRuns }) =>
  recentDefaultBranchRuns
    .map(run =>
      run.fileSizes.map(fileSize => ({
        key: fileSize.file,
        x: run.sha.slice(0, 7),
        y: fileSize.size,
      })),
    )
    .reduce((sizes, runFileSizes) => {
      let newSizes = { ...sizes }
      runFileSizes.forEach(runFileSize => {
        const exisitingFileSizes = newSizes[runFileSize.key] || []
        newSizes = {
          ...newSizes,
          [runFileSize.key]: [
            ...exisitingFileSizes,
            {
              x: runFileSize.x,
              y: runFileSize.y,
            },
          ],
        }
      })
      return newSizes
    }, {})

const RecentRuns = ({ recentDefaultBranchRuns }) => (
  <div style={{ flexGrow: 1 }}>
    <FileSizeChart
      fileSizes={parseRecentFileSizes({ recentDefaultBranchRuns })}
    />
  </div>
)

export default ({
  loading,
  run: {
    fileSizes,
    start,
    stop,
    created,
    errorMessage,
    recentDefaultBranchRuns,
  },
}) => (
  <Page>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {loading || errorMessage ? null : (
        <RunComponent
          recentDefaultBranchRuns={recentDefaultBranchRuns}
          fileSizes={fileSizes}
          start={start}
          stop={stop}
          created={created}
        />
      )}
      {loading || !errorMessage ? null : (
        <ErrorDisplay errorMessage={errorMessage} />
      )}
      {loading || errorMessage ? null : (
        <RecentRuns recentDefaultBranchRuns={recentDefaultBranchRuns} />
      )}
    </div>
  </Page>
)
