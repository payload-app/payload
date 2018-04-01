import React from 'react'
import { storiesOf } from '@storybook/react'
import FileListViz from './'

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
