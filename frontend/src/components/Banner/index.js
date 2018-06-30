import React from 'react'
import { calculateStyles } from '../utils/calculateStyles'
import Text from '../Text'
import Link from '../Link'
import Pulse from '../Pulse'
import {
  invertedBackground,
  invertedText,
  brightRed,
  text,
  background,
} from '../style/color'

const ActionLink = ({ type, text: childrenText, href, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    color={type === 'warning' || type === 'error' ? text : invertedText}
  >
    {childrenText}
  </Link>
)

const BannerContent = ({ type, children, actionLink }) => (
  <div
    style={calculateStyles(
      {
        default: {
          background: invertedBackground,
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
        },
        warning: {
          background: brightRed,
        },
        error: {
          background: 'none',
        },
      },
      {
        warning: type === 'warning',
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
      <Text
        size={2}
        color={type === 'warning' || type === 'error' ? text : invertedText}
      >
        {children}
      </Text>
    </div>
    {actionLink ? <ActionLink {...actionLink} type={type} /> : null}
  </div>
)

const Banner = ({ type, children, actionLink }) =>
  type === 'error' ? (
    <Pulse backgroundColor={brightRed} display={'block'} speed={1000}>
      <BannerContent type={type} actionLink={actionLink}>
        {children}
      </BannerContent>
    </Pulse>
  ) : (
    <BannerContent type={type} actionLink={actionLink}>
      {children}
    </BannerContent>
  )

export default Banner
