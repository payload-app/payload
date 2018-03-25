import React from 'react'
import prettyBytes from 'pretty-bytes'
import { text } from '../../../components/style/color'
import { fontFamily } from '../../../components/style/font'
import {
  FlexibleWidthXYPlot,
  VerticalBarSeries,
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
      <FlexibleWidthXYPlot
        margin={{ left: 70, bottom: 80 }}
        onMouseLeave={this._onMouseLeave}
        style={{
          fontFamily,
        }}
        height={500}
        xType={'ordinal'}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis
          tickLabelAngle={-45}
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
          <VerticalBarSeries
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
            line: {
              display: 'none',
            },
          }}
          values={this.state.crosshairValues}
          itemsFormat={values =>
            values.map(value => ({
              title: value.fileName,
              value: value.y,
            }))
          }
          titleFormat={values => ({
            title: 'sha',
            value: values[0].x,
          })}
        />
      </FlexibleWidthXYPlot>
    )
  }
}
