import React from 'react'
import { storiesOf } from '@storybook/react'
import LoadingBar from './index'

storiesOf('LoadingBar', module)
  .add('default', () => <LoadingBar />)
  .add('mounted = true', () => <LoadingBar mounted={true} />)
  .add('animate on mount', () => {
    class Loading extends React.Component {
      state = {
        mounted: false,
      }
      componentDidMount() {
        this.setState({ mounted: true })
      }
      render() {
        return <LoadingBar mounted={this.state.mounted} />
      }
    }

    return <Loading />
  })
