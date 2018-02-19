import React from 'react'
import { white, mutedWhite } from '../../../components/style/color'
import Transition from 'react-transition-group/Transition'

const bigWhiteBarStyle = {
  default: {
    width: 280,
    height: 4,
    background: white,
    marginRight: 5,
    transition: `transform 400ms 200ms ease-in-out`,
    transform: 'scaleX(0)',
    transformOrigin: 'left',
  },
  entered: {
    transform: 'scaleX(1)',
  },
}

const smallMutedBarStyle = {
  default: {
    width: 40,
    height: 4,
    background: mutedWhite,
    transition: `transform 600ms ease-in-out`,
    transform: 'scaleX(0) translateX(-100px)',
    transformOrigin: 'right',
  },
  entering: {
    transform: 'scaleX(7) translateX(-100px)',
  },
  entered: {
    transform: 'scaleX(1) translateX(0)',
  },
}

const thinBarStyle = {
  default: {
    marginTop: 4,
    width: 380,
    position: 'realtive',
    boxShadow: `inset 0 1px ${mutedWhite}`,
    height: 1,
    transition: `transform 200ms 100ms ease-in-out`,
    transform: 'scaleX(0)',
    transformOrigin: 'left',
  },
  entered: {
    transform: 'scaleX(1)',
  },
}

export default ({ mounted = false, loading = false }) => (
  <Transition in={mounted} timeout={0}>
    {state => (
      <div>
        <div style={{ display: 'flex', overflow: 'hidden' }}>
          <div
            style={{
              ...bigWhiteBarStyle.default,
              ...bigWhiteBarStyle[state],
            }}
          />
          <div
            style={{
              ...smallMutedBarStyle.default,
              ...smallMutedBarStyle[state],
            }}
          />
        </div>

        <div
          style={{
            ...thinBarStyle.default,
            ...thinBarStyle[state],
          }}
        >
          <div style={{ position: 'absolute', right: 0 }}>
            <div
              style={{
                width: 4,
                height: 4,
                marginBottom: 4,
                background: white,
              }}
            />
            <div
              style={{
                width: 4,
                height: 20,
                background: mutedWhite,
              }}
            />
          </div>
        </div>
      </div>
    )}
  </Transition>
)
