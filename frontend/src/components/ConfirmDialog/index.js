import React from 'react'
import InvertedPanel from '../InvertedPanel'
import Text from '../Text'
import { invertedText } from '../style/color'

const ConfirmDialog = ({ children, title }) => (
  <InvertedPanel>
    <div>
      <Text color={invertedText} size={2}>
        {title}
      </Text>
    </div>
    <div>
      <Text color={invertedText}>{children}</Text>
    </div>
  </InvertedPanel>
)

export default ConfirmDialog
