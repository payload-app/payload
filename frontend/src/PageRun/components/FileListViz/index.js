import React from 'react'
import _ from 'lodash'

import Transition from 'react-transition-group/Transition'
import FileVizItem from './FileVizItem'

export const FileListViz = ({ files = [], mounted = false }) => {
  const largestFile = _(files)
    .map('size')
    .max()
  const largestPrevFile = _(files)
    .map('prevSize')
    .max()
  return (
    <div>
      {files.map(({ fileName, size, prevSize }, i) => (
        <Transition key={fileName} in={mounted} timeout={i * 200}>
          {animationState => (
            <div style={{ marginBottom: 2 }}>
              <FileVizItem
                animationState={animationState}
                fileName={fileName}
                size={size}
                prevSize={prevSize}
                number={i + 1}
                largestGraphSize={Math.max(largestFile, largestPrevFile)}
              />
            </div>
          )}
        </Transition>
      ))}
    </div>
  )
}

export default class extends React.Component {
  state = {
    mounted: false,
  }

  componentDidMount() {
    this.setState({ mounted: true })
  }

  render() {
    return <FileListViz {...this.props} {...this.state} />
  }
}
