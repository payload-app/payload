import React from 'react'
import { text } from '../../../components/style/color'
import {
  XYPlot,
  LineSeries,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
} from 'react-vis'

export default ({ fileSizes }) => (
  <XYPlot height={300} width={800}>
    <VerticalGridLines />
    <HorizontalGridLines />
    <XAxis
      style={{
        text: {
          fontSize: '1.5rem',
          fill: text,
        },
      }}
    />
    <YAxis
      style={{
        text: {
          fontSize: '1.5rem',
          fill: text,
        },
      }}
    />
    {Object.keys(fileSizes).map(fileName => (
      <LineSeries key={fileName} data={fileSizes[fileName]} />
    ))}
  </XYPlot>
)
