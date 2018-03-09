import React, { Component } from 'react'
import {
  Image,
  Text,
  Popover,
  Link,
  HR,
  Overlay,
  Button,
} from '../../../components'
import { text } from '../../../components/style/color'

const getAvatar = ({ user }) => user.accounts.github.avatar
const getName = ({ user }) => user.accounts.github.name
const getEmail = ({ user }) => user.email

export default class UserMenuItem extends Component {
  constructor() {
    super()
    this.state = {
      popoverVisible: false,
    }
  }

  handleItemClick() {
    this.setState({
      popoverVisible: true,
    })
  }

  handleOverlayClick() {
    this.setState({
      popoverVisible: false,
    })
  }

  render() {
    const { user } = this.props
    const { popoverVisible } = this.state
    return (
      <div>
        <div
          style={{
            position: 'relative',
          }}
        >
          <Button
            noStyle={true}
            fillContainer={true}
            onClick={() => this.handleItemClick()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div style={{ flexGrow: 1 }}>
                <Text weight={400}>{getName({ user })}</Text>
              </div>
              <Image
                height={'4rem'}
                width={'4rem'}
                circle={true}
                src={getAvatar({ user })}
              />
            </div>
          </Button>
          <Popover hidden={!popoverVisible}>
            <div
              style={{
                border: `1px solid ${text}`,
                padding: '1rem',
              }}
            >
              <Text>{getEmail({ user })}</Text>
              <HR />
              <div>
                <Link>Settings</Link>
              </div>
              <div>
                <Link>Logout</Link>
              </div>
            </div>
          </Popover>
        </div>
        {popoverVisible ? (
          <Overlay onClick={() => this.handleOverlayClick()} />
        ) : null}
      </div>
    )
  }
}
