import React from 'react'
import prettyBytes from 'pretty-bytes'
import { text } from '../../../components/style/color'
import { fontFamily } from '../../../components/style/font'
import {
  XYPlot,
  LineMarkSeries,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  Crosshair,
} from 'react-vis'
import '../../../../node_modules/react-vis/dist/style.css'

export default class FileSizeChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      crosshairValues: [],
    }
    this._onMouseLeave = this._onMouseLeave.bind(this)
    this._onNearestX = this._onNearestX.bind(this)
  }

  _onNearestX(value, { index }) {
    const crosshairValues = Object.keys(this.props.fileSizes).map(fileName => ({
      ...this.props.fileSizes[fileName][index],
      fileName,
    }))
    this.setState({
      crosshairValues,
    })
  }

  _onMouseLeave() {
    this.setState({ crosshairValues: [] })
  }

  render() {
    return (
      <XYPlot
        margin={{ left: 100 }}
        height={300}
        width={800}
        onMouseLeave={this._onMouseLeave}
        style={{
          fontFamily,
        }}
      >
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
          tickFormat={t => <tspan>{prettyBytes(t)}</tspan>}
        />
        {Object.keys(this.props.fileSizes).map(fileName => (
          <LineMarkSeries
            onNearestX={this._onNearestX}
            key={fileName}
            data={this.props.fileSizes[fileName]}
          />
        ))}
        <Crosshair
          style={{
            box: {
              fontFamily,
            },
          }}
          values={this.state.crosshairValues}
          itemsFormat={values =>
            values.map(value => ({
              title: value.fileName,
              value: value.y,
            }))
          }
        />
      </XYPlot>
    )
  }
}
