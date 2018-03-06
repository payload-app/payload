import React from 'react'
import Overlay from '../Overlay'
import { modal } from '../style/zIndex'
import { text } from '../style/color'
import { calculateStyles } from '../utils/calculateStyles'

export default ({
  children,
  left,
  top,
  bottom,
  right,
  onOverlayClick,
  transparentOverlay,
}) => (
  <span>
    <div
      style={calculateStyles(
        {
          default: {
            position: 'absolute',
            left,
            top,
            bottom,
            right,
            zIndex: modal,
          },
          center: {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          },
        },
        {
          center: !(left || top || bottom || right),
        },
      )}
    >
      {children}
    </div>
    <Overlay
      onClick={onOverlayClick}
      background={text}
      opacity={transparentOverlay ? 0 : 0.2}
    />
  </span>
)
