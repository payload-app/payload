import React from 'react'
import { Link, IconGithub, Button } from '../../../components'
import Header from '../../../Header'

export default () => (
  <div>
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
