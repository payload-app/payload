import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs, select } from '@storybook/addon-knobs/react'
import FileListViz from './'
import FileVizItem from './FileVizItem'

const files = [
  {
    fileName: 'build/webpack.prod.js',
    size: 3145728,
    prevSize: 1048576,
  },
  {
    fileName: 'build/webpack.prod.css',
    size: 524288,
    prevSize: 1120141,
  },
  {
    fileName: 'package.json',
    size: 541927,
    prevSize: 541927,
  },
]

storiesOf('FileListViz', module).add('default', () => (
  <div style={{ padding: 40 }}>
    <FileListViz files={files} />
  </div>
))

storiesOf('FileVizItem', module)
  .addDecorator(withKnobs)
  .add('default', () => {
    const animationState = select('animationState', {
      entering: 'entering',
      entered: 'entered',
      exiting: 'exiting',
      exited: 'exited',
    })

    return (
      <div style={{ padding: 40 }}>
        <FileVizItem
          animationState={animationState}
          {...files[0]}
          number={1}
          largestGraphSize={3145728}
        />
      </div>
    )
  })
