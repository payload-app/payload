import React from 'react'
import { storiesOf } from '@storybook/react'
import '@storybook/addon-actions/register'
import '@storybook/addon-links/register'
import AnimatedText from './index'

storiesOf('AnimatedText', module)
  .add('default', () => <AnimatedText>oh hey!</AnimatedText>)
  .add('cursor', () => (
    <AnimatedText cursor={true}>oh hey, I have a cursor!</AnimatedText>
  ))
  .add('speed = 100', () => (
    <AnimatedText speed={100}>This is some slow text</AnimatedText>
  ))
  .add('speed = 10', () => (
    <AnimatedText speed={10}>Hasten forward quickly there</AnimatedText>
  ))
  .add('delay = 1000', () => (
    <div>
      <span>Wait for it</span>
      <AnimatedText delay={1000}>There It Is</AnimatedText>
    </div>
  ))
