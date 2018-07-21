import React from 'react'
import { Link, IconGithub, Button } from '../../../components'
import Header from '../../../Header'

export default () => (
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
      <Link href="/login">
        <Button Icon={IconGithub} fontSize={2}>
          Authenticate With Github
        </Button>
      </Link>
    </div>
  </div>
)
