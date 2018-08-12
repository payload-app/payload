import React from 'react'
import { Link, IconGithub, Button, Text, style } from '@payloadapp/components'
const { color: { red } } = style
import Header from '../../../Header'

const generateQueryString = ({ email, inviteToken }) => {
  if (email && inviteToken) {
    return `?email=${encodeURIComponent(
      email,
    )}&inviteToken=${encodeURIComponent(inviteToken)}`
  }
  return ''
}

const parseErrorCode = ({ errorCode }) => {
  switch (errorCode) {
    case '1001':
      return 'Failed to authenticate with GitHub... try again?'
    case '1002':
      return 'There was an error from GitHub... try again?'
    default:
      return 'An unexpected error occured... try again?'
  }
}

const ErrorDisplay = ({ errorCode }) => (
  <div
    style={{
      marginBottom: '3rem',
    }}
  >
    <div
      style={{
        background: red,
        display: 'inline-block',
      }}
    >
      <Text size={2.5} capitalize>
        {parseErrorCode({ errorCode })}
      </Text>
    </div>
  </div>
)

export default ({ email, inviteToken, errorCode }) => (
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
    <div style={{ marginTop: '6rem' }}>
      {errorCode ? <ErrorDisplay errorCode={errorCode} /> : null}
      <Link href={`/login${generateQueryString({ email, inviteToken })}`}>
        <Button Icon={IconGithub} fontSize={2}>
          Authenticate With Github
        </Button>
      </Link>
    </div>
  </div>
)
