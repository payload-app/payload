import React from 'react'
import { modal } from '../style/zIndex'
import { calculateStyles } from '../utils/calculateStyles'

const defaultAnchor = 'rightUp'

const calcPosition = ({ anchor }) => {
  if (anchor === 'left') {
    return {
      bottom: 0,
      right: 'calc(100% + 2rem)',
      transform: 'translateY(50%)',
    }
  } else if (anchor === 'leftUp') {
    return {
      bottom: 0,
      right: 'calc(100% + 2rem)',
    }
  } else if (anchor === 'leftDown') {
    return {
      top: 0,
      right: 'calc(100% + 2rem)',
    }
  } else if (anchor === 'right') {
    return {
      bottom: 0,
      left: 'calc(100% + 2rem)',
      transform: 'translateY(50%)',
    }
  } else if (anchor === 'rightUp') {
    return {
      bottom: 0,
      left: 'calc(100% + 2rem)',
    }
  } else if (anchor === 'rightDown') {
    return {
      top: 0,
      left: 'calc(100% + 2rem)',
    }
  } else if (anchor === 'above') {
    return {
      top: 0,
      right: '50%',
      transform: 'translateX(50%) translateY(calc(-100% - 2rem))',
    }
  } else if (anchor === 'aboveRight') {
    return {
      top: 0,
      left: 0,
      transform: ' translateY(calc(-100% - 2rem))',
    }
  } else if (anchor === 'aboveLeft') {
    return {
      top: 0,
      right: 0,
      transform: ' translateY(calc(-100% - 2rem))',
    }
  } else if (anchor === 'below') {
    return {
      bottom: 0,
      right: '50%',
      transform: 'translateX(50%) translateY(calc(100% + 2rem))',
    }
  } else if (anchor === 'belowRight') {
    return {
      bottom: 0,
      left: 0,
      transform: 'translateY(calc(100% + 2rem))',
    }
  } else if (anchor === 'belowLeft') {
    return {
      bottom: 0,
      right: 0,
      transform: 'translateY(calc(100% + 2rem))',
    }
  } else if (anchor === 'none') {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
    }
  }
}

export default ({ children, hidden, anchor = defaultAnchor }) => (
  <div
    style={calculateStyles(
      {
        default: {
          position: 'absolute',
          zIndex: modal,
          ...calcPosition({ anchor }),
        },
        hidden: {
          display: 'none',
        },
      },
      {
        hidden,
      },
    )}
  >
    {children}
  </div>
)
