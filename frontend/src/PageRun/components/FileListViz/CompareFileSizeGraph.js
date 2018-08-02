import React from 'react'
import _ from 'lodash'
import { style } from '@payloadapp/components'
const { color: { white, mutedWhite, brightRed } } = style

export const CompareFileSizeGraph = ({
  primary,
  secondary,
  max = Math.max(primary, secondary),
  animationStyles,
}) => {
  const styles = _.merge(animationStyles, {
    graph: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    primaryBar: {
      height: 4,
      background: primary <= secondary ? white : brightRed,
      width: `${primary / max * 100}%`,
    },
    secondaryBar: {
      marginTop: 4,
      height: 2,
      background: mutedWhite,
      width: `${secondary / max * 100}%`,
    },
  })

  return (
    <div style={styles.graph}>
      <div style={styles.primaryBar} />
      <div style={styles.secondaryBar} />
    </div>
  )
}

export default ({ animationState, ...props }) => {
  const animationStyles = {
    default: {
      graph: {
        transition: `transform 400ms 600ms cubic-bezier(.2,.4,.4,1)`,
        transform: 'translateX(10px)',
      },
      primaryBar: {
        transition: `transform 800ms 600ms cubic-bezier(.2,.4,.4,1)`,
        transform: 'scaleX(0)',
        transformOrigin: 'left',
      },
      secondaryBar: {
        transition: `transform 800ms 600ms cubic-bezier(.2,.4,.4,1)`,
        transform: 'scaleX(0)',
        transformOrigin: 'left',
      },
    },
    entered: {
      graph: {
        transform: 'translateX(0)',
      },
      primaryBar: {
        transform: 'scaleX(1)',
      },
      secondaryBar: {
        transform: 'scaleX(1)',
      },
    },
  }

  return (
    <CompareFileSizeGraph
      {...props}
      animationStyles={_.merge(
        animationStyles.default,
        animationStyles[animationState],
      )}
      animationState={animationState}
    />
  )
}
