import React from 'react'
import Transition from 'react-transition-group/Transition'

export class FadeInChildren extends React.Component {
  state = {
    loaded: false,
  }

  componentDidMount() {
    this.setState({ loaded: true })
  }

  render() {
    const { loaded } = this.state
    const { children, delayBetween = 200, speed = 400 } = this.props

    const styles = {
      default: {
        transition: `opacity ${speed}ms 400ms cubic-bezier(.2,.4,.4,1)`,
        opacity: 0,
      },
      entered: {
        opacity: 1,
      },
    }

    return React.Children.map(children, (child, i) => (
      <Transition key={child.key} in={loaded} timeout={i * delayBetween}>
        {animationState => (
          <div style={{ ...styles.default, ...styles[animationState] }}>
            {child}
          </div>
        )}
      </Transition>
    ))
  }
}

export default FadeInChildren
