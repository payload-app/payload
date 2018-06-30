import React from 'react'
import { calculateStyles } from '../utils/calculateStyles'
import Text from '../Text'
import Link from '../Link'
import {
  invertedBackground,
  invertedText,
  brightRed,
  text,
} from '../style/color'

const ActionLink = ({ type, text: childrenText, href, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    color={type === 'error' ? text : invertedText}
  >
    {childrenText}
  </Link>
)

const Banner = ({ type, children, actionLink }) => (
  <div
    style={calculateStyles(
      {
        default: {
          background: invertedBackground,
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
        },
        error: {
          background: brightRed,
        },
      },
      {
        error: type === 'error',
      },
    )}
  >
    <div
      style={{
        flexGrow: 1,
        marginRight: '1rem',
      }}
    >
      <Text size={2} color={type === 'error' ? text : invertedText}>
        {children}
      </Text>
    </div>
    {actionLink ? <ActionLink {...actionLink} type={type} /> : null}
  </div>
)

export default Banner
