import React from 'react'
import { Link, IconGithub, Button } from '../../../components'
import Header from '../../../Header'

const generateQueryString = ({ email, inviteToken }) => {
  if (email && inviteToken) {
    return `?email=${encodeURIComponent(
      email,
    )}&inviteToken=${encodeURIComponent(inviteToken)}`
  }
  return ''
}

export default ({ email, inviteToken }) => (
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
      <Link href={`/login${generateQueryString({ email, inviteToken })}`}>
        <Button Icon={IconGithub} fontSize={2}>
          Authenticate With Github
        </Button>
      </Link>
    </div>
  </div>
)
