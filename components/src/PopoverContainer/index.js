import React, { Component } from 'react'
import Overlay from '../Overlay'
import Popover from '../Popover'

export default class PopoverContainer extends Component {
  constructor() {
    super()
    this.state = {
      popoverVisible: false,
    }
  }

  handleShowPopover() {
    this.setState({
      popoverVisible: true,
    })
  }

  handleHidePopover() {
    this.setState({
      popoverVisible: false,
    })
  }

  render() {
    const {
      AnchorComponent,
      PopoverComponent,
      popoverAnchor,
      ...rest
    } = this.props
    const { popoverVisible } = this.state
    return (
      <div>
        <div
          style={{
            position: 'relative',
          }}
        >
          <AnchorComponent
            onShowPopover={() => this.handleShowPopover()}
            onHidePopover={() => this.handleHidePopover()}
            {...rest}
          />
          <Popover hidden={!popoverVisible} anchor={popoverAnchor}>
            <PopoverComponent
              onShowPopover={() => this.handleShowPopover()}
              onHidePopover={() => this.handleHidePopover()}
              {...rest}
            />
          </Popover>
        </div>
        {popoverVisible ? (
          <Overlay onClick={() => this.handleHidePopover()} />
        ) : null}
      </div>
    )
  }
}
