import React from 'react'
import Header from '../../../Header'
import { Text, FadeInChildren } from '../../../components'
import { mutedWhite } from '../../../components/style/color'

const PageInvited = ({ invitesBefore, invitesAfter }) => (
  <div
    style={{
      paddingTop: 40,
      paddingRight: 50,
      paddingLeft: 50,
      margin: '0 auto',
      minWidth: '60rem',
      maxWidth: '120rem',
    }}
  >
    <Header />
    <div
      style={{
        margin: '6rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <FadeInChildren delayBetween={500}>
        <Text size={10} capitalize={true}>{`${invitesBefore}`}</Text>
        <Text capitalize={true}>People In Front Of You</Text>
        <Text
          size={5}
          capitalize={true}
          color={mutedWhite}
        >{`${invitesAfter}`}</Text>
        <Text capitalize={true} color={mutedWhite}>
          People Behind You
        </Text>
      </FadeInChildren>
    </div>
  </div>
)

export default PageInvited
