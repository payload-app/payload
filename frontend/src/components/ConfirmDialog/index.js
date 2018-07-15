import React from 'react'
import InvertedPanel from '../InvertedPanel'
import Text from '../Text'
import Button from '../Button'
import { invertedText, text, background } from '../style/color'

const ConfirmDialog = ({
  children,
  title,
  width,
  maxWidth,
  onConfirmClick,
  onCancelClick,
}) => (
  <InvertedPanel padding={3} width={width} maxWidth={maxWidth}>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ alignSelf: 'center', marginBottom: '2rem' }}>
        <Text color={invertedText} size={3} capitalize>
          {title}
        </Text>
      </div>
      <div style={{ marginBottom: '2rem', alignSelf: 'center' }}>
        <Text color={invertedText} size={2} capitalize>
          {children}
        </Text>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ marginRight: '1rem' }}>
          <Button onClick={onCancelClick}>Cancel</Button>
        </div>
        <div style={{ marginLeft: '1rem' }}>
          <Button onClick={onConfirmClick} color={text} background={background}>
            Confirm?
          </Button>
        </div>
      </div>
    </div>
  </InvertedPanel>
)

export default ConfirmDialog
