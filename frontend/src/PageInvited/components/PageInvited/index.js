import React from 'react'
import Header from '../../../Header'
import { Pulse, Text, FadeInChildren, style } from '@payloadapp/components'
const { color: { mutedWhite } } = style

const Loading = () => <Text>Loading...</Text>
const Error = ({ error }) => (
  <Pulse>
    <Text size={3}>{error}</Text>
  </Pulse>
)

const PageInvited = ({ invitesBefore, invitesAfter, loading, error }) => (
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
      {error ? <Error error={error} /> : null}
      {loading ? <Loading /> : null}
      {!loading && !error ? (
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
      ) : null}
    </div>
  </div>
)

export default PageInvited
