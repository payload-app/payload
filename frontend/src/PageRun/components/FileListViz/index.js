import React from 'react'
import _ from 'lodash'
import { Text, AnimateText } from '../../../components'
import {
  white,
  mutedWhite,
  softLighten,
  brightRed,
} from '../../../components/style/color'
import prettyBytes from 'pretty-bytes'

import Transition from 'react-transition-group/Transition'

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

const CompareFileSizeGraph = ({
  primary,
  secondary,
  max = Math.max(primary, secondary),
  animationState,
}) => {
  const graphStyle = {
    default: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',

      transition: `transform 400ms 600ms cubic-bezier(.2,.4,.4,1)`,
      transform: 'translateX(10px)',
    },
    entered: {
      transform: 'translateX(0)',
    },
  }

  const primaryBarStyle = {
    default: {
      height: 4,
      background: primary <= secondary ? white : brightRed,
      width: `${primary / max * 100}%`,

      transition: `transform 800ms 600ms cubic-bezier(.2,.4,.4,1)`,
      transform: 'scaleX(0)',
      transformOrigin: 'left',
    },
    entered: {
      transform: 'scaleX(1)',
    },
  }

  const secondaryBarStyle = {
    default: {
      marginTop: 4,
      height: 2,
      background: mutedWhite,
      width: `${secondary / max * 100}%`,

      transition: `transform 800ms 600ms cubic-bezier(.2,.4,.4,1)`,
      transform: 'scaleX(0)',
      transformOrigin: 'left',
    },
    entered: {
      transform: 'scaleX(1)',
    },
  }

  return (
    <div style={combineCSS({ style: graphStyle, animationState })}>
      <div style={combineCSS({ style: primaryBarStyle, animationState })} />
      <div style={combineCSS({ style: secondaryBarStyle, animationState })} />
    </div>
  )
}

const SizeChangePercent = ({ size, prevSize }) => {
  const change = (size - prevSize) / prevSize * 100
  const increased = change > 0

  const symbol = increased ? '↗' : change < 0 ? '↘' : '-'

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Text
        size={2.4}
        color={increased ? brightRed : white}
        weight={increased ? 600 : 400}
      >
        {symbol}
      </Text>
      <Text size={1} color={mutedWhite} weight={400}>
        {`${change.toFixed(2)}%`}
      </Text>
    </div>
  )
}

const SplitFileSize = ({ size }) => {
  const [smallSize, sizeLabel] = prettyBytes(size).split(' ')

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <AnimateText delay={1000} speed={80} size={2} weight={400}>
        {smallSize}
      </AnimateText>

      <span style={{ marginLeft: 4, marginBottom: 2 }}>
        <Text size={1} capitalize={true}>
          {sizeLabel}
        </Text>
      </span>
    </div>
  )
}

const combineCSS = ({ style, animationState }) => ({
  ...style.default,
  ...style[animationState],
})

const FileVizItem = ({
  fileName,
  size,
  prevSize,
  number,
  largestGraphSize,
  animationState,
}) => {
  const numberModuleStyle = {
    default: {
      backgroundColor: mutedWhite,
      width: 50,
      height: 50,
      marginRight: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      transition: `transform 800ms cubic-bezier(.2,.4,.4,1)`,
      transform: 'scaleX(0)',
      transformOrigin: 'left',
    },
    entered: {
      transform: 'scaleX(1)',
    },
  }

  const numberStyle = {
    default: {
      transition: `opacity 600ms 800ms cubic-bezier(.2,.4,.4,1)`,
      opacity: 0,
    },
    entered: {
      opacity: 1,
    },
  }

  const fileStyle = {
    default: {
      backgroundColor: softLighten,
      display: 'flex',
      alignItems: 'center',
      flex: 3,
      paddingLeft: 15,
      paddingRight: 15,

      transition: `transform 800ms cubic-bezier(.2,.4,.4,1)`,
      transform: 'scaleX(0)',
      transformOrigin: 'left',
    },
    entered: {
      transform: 'scaleX(1)',
    },
  }

  const arrowStyle = {
    default: {
      width: 50,
      height: 50,

      transition: `opacity 800ms 800ms cubic-bezier(.2,.4,.4,1)`,
      opacity: 0,
    },
    entered: {
      opacity: 1,
    },
  }

  const sizeStyle = {
    default: {
      minWidth: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',

      transition: `opacity 800ms 800ms cubic-bezier(.2,.4,.4,1)`,
      opacity: 0,
    },
    entered: {
      opacity: 1,
    },
  }

  const decorationStyle = {
    default: {
      width: 10,
      borderRight: `1px solid ${mutedWhite}`,
      borderTop: `1px solid ${mutedWhite}`,
      height: 10,

      transition: `transform 200ms 1400ms cubic-bezier(.2,.4,.4,1)`,
      transform: 'scaleX(0)',
      transformOrigin: 'top right',
    },
    entered: {
      transform: 'scaleX(1)',
    },
  }

  const styles = {
    item: {
      display: 'flex',
    },
    graph: {
      flex: 2,
      paddingRight: 15,
      display: 'flex',
    },
  }

  return (
    <div style={styles.item}>
      <div style={combineCSS({ style: numberModuleStyle, animationState })}>
        <div style={combineCSS({ style: numberStyle, animationState })}>
          <Text size={2} weight={400}>
            {_.padStart(number, 2, '0')}
          </Text>
        </div>
      </div>

      <div style={combineCSS({ style: fileStyle, animationState })}>
        {animationState === 'entered' && (
          <AnimateText delay={300} speed={40} size={2} capitalize={true}>
            {fileName}
          </AnimateText>
        )}
      </div>

      <div style={combineCSS({ style: arrowStyle, animationState })}>
        <SizeChangePercent size={size} prevSize={prevSize} />
      </div>

      <div style={styles.graph}>
        <CompareFileSizeGraph
          primary={size}
          secondary={prevSize}
          max={largestGraphSize}
          animationState={animationState}
        />
      </div>

      <div style={combineCSS({ style: sizeStyle, animationState })}>
        {animationState === 'entered' && <SplitFileSize size={size} />}
      </div>

      <div style={combineCSS({ style: decorationStyle, animationState })} />
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
