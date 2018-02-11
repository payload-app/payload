import React from 'react'
import { storiesOf } from '@storybook/react'
import AnimateText from './index'

storiesOf('AnimateText', module)
  .add('default', () => <AnimateText>oh hey!</AnimateText>)
  .add('cursor', () => (
    <AnimateText cursor={true}>oh hey, I have a cursor!</AnimateText>
  ))
  .add('speed = 100', () => (
    <AnimateText speed={100}>This is some slow text</AnimateText>
  ))
  .add('speed = 10', () => (
    <AnimateText speed={10}>Hasten forward quickly there</AnimateText>
  ))
  .add('delay = 1000', () => (
    <div>
      <span>Wait for it</span>
      <AnimateText delay={1000}>There It Is</AnimateText>
    </div>
  ))
  .add('size = 2', () => (
    <AnimateText size={2}>This is some huge text</AnimateText>
  ))
  .add('color = red', () => (
    <AnimateText color={'red'}>This is some red text</AnimateText>
  ))
  .add('uppercase = true', () => (
    <AnimateText capitalize={true}>This is some uppercase text</AnimateText>
  ))
