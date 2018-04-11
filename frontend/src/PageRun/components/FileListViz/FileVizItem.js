import React from 'react'
import _ from 'lodash'
import { Text, AnimateText } from '../../../components'
import { mutedWhite, softLighten } from '../../../components/style/color'

import CompareFileSizeGraph from './CompareFileSizeGraph'
import SizeChangePercent from './SizeChangePercent'
import SplitFileSize from './SplitFileSize'

export const FileVizItem = ({
  fileName,
  size,
  prevSize,
  number,
  largestGraphSize,
  animationState,
  animationStyles,
}) => {
  const styles = _.merge(animationStyles, {
    item: {
      display: 'flex',
    },
    numberModule: {
      backgroundColor: mutedWhite,
      width: 50,
      height: 50,
      marginRight: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    file: {
      backgroundColor: softLighten,
      display: 'flex',
      alignItems: 'center',
      flex: 3,
      paddingLeft: 15,
      paddingRight: 15,
    },
    arrow: {
      width: 50,
      height: 50,
    },
    graph: {
      flex: 2,
      paddingRight: 15,
      display: 'flex',
    },
    size: {
      minWidth: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    decoration: {
      width: 10,
      borderRight: `1px solid ${mutedWhite}`,
      borderTop: `1px solid ${mutedWhite}`,
      height: 10,
    },
  })

  return (
    <div style={styles.item}>
      <div style={styles.numberModule}>
        <div style={styles.number}>
          <Text size={2} weight={400}>
            {_.padStart(number, 2, '0')}
          </Text>
        </div>
      </div>

      <div style={styles.file}>
        {animationState === 'entered' && (
          <AnimateText delay={300} speed={40} size={2} capitalize={true}>
            {fileName}
          </AnimateText>
        )}
      </div>

      <div style={styles.arrow}>
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

      <div style={styles.size}>
        {animationState === 'entered' && <SplitFileSize size={size} />}
      </div>

      <div style={styles.decoration} />
    </div>
  )
}

export default ({ animationState, ...props }) => {
  const animationStyles = {
    default: {
      numberModule: {
        transition: `transform 800ms cubic-bezier(.2,.4,.4,1)`,
        transform: 'scaleX(0)',
        transformOrigin: 'left',
      },
      number: {
        transition: `opacity 600ms 800ms cubic-bezier(.2,.4,.4,1)`,
        opacity: 0,
      },
      file: {
        transition: `transform 800ms cubic-bezier(.2,.4,.4,1)`,
        transform: 'scaleX(0)',
        transformOrigin: 'left',
      },
      arrow: {
        transition: `opacity 800ms 800ms cubic-bezier(.2,.4,.4,1)`,
        opacity: 0,
      },
      size: {
        transition: `opacity 800ms 800ms cubic-bezier(.2,.4,.4,1)`,
        opacity: 0,
      },
      decoration: {
        transition: `transform 200ms 1400ms cubic-bezier(.2,.4,.4,1)`,
        transform: 'scaleX(0)',
        transformOrigin: 'top right',
      },
    },
    entered: {
      numberModule: {
        transform: 'scaleX(1)',
      },
      number: {
        opacity: 1,
      },
      file: {
        transform: 'scaleX(1)',
      },
      arrow: {
        opacity: 1,
      },
      size: {
        opacity: 1,
      },
      decoration: {
        transform: 'scaleX(1)',
      },
    },
  }

  return (
    <FileVizItem
      {...props}
      animationStyles={_.merge(
        animationStyles.default,
        animationStyles[animationState],
      )}
      animationState={animationState}
    />
  )
}
