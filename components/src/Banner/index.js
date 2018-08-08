import React from 'react'
import calculateStyles from '../utils/calculateStyles'
import Text from '../Text'
import Button from '../Button'
import Pulse from '../Pulse'
import {
  invertedBackground,
  background,
  invertedText,
  brightRed,
  text,
} from '../style/color'

const ActionButton = ({ type, text: childrenText, onClick }) => (
  <Button
    onClick={onClick}
    color={type === 'default' ? text : brightRed}
    background={type === 'default' ? background : invertedBackground}
  >
    {childrenText}
  </Button>
)

const BannerContent = ({ type, children, actionButton }) => (
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
        capitalize
      >
        {children}
      </Text>
    </div>
    {actionButton ? <ActionButton {...actionButton} type={type} /> : null}
  </div>
)

const Banner = ({ type = 'default', children, actionButton }) =>
  type === 'error' ? (
    <Pulse backgroundColor={brightRed} display={'block'} speed={1000}>
      <BannerContent type={type} actionButton={actionButton}>
        {children}
      </BannerContent>
    </Pulse>
  ) : (
    <BannerContent type={type} actionButton={actionButton}>
      {children}
    </BannerContent>
  )

export default Banner
