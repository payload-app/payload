import React from 'react'
import { storiesOf } from '@storybook/react'
import FileSizeChart from './'
import fileSizes from './fileSizeData'

storiesOf('FileSizeChart', module)
  .add('default', () => <FileSizeChart fileSizes={fileSizes} />)
  .add('test data', () => (
    <FileSizeChart
      fileSizes={{
        'generatedfile.dat': [
          {
            x: 0,
            y: 10,
          },
          {
            x: 2,
            y: 10,
          },
          {
            x: 4,
            y: 10,
          },
          {
            x: 6,
            y: 20,
          },
        ],
      }}
    />
  ))
