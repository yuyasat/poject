import React from 'react'

import ControllerButton from '../ControllerButton'

import './Styles.css'

export default function Controller (props) {
  return (
    <div>
      <div className='ControllerButtomWrap'>
        <ControllerButton position='left' onClick={props.onKeyDown} />
        <ControllerButton position='right' onClick={props.onKeyDown} />
        <ControllerButton position='x' onClick={props.onKeyDown} />
        <ControllerButton position='z' onClick={props.onKeyDown} />
        <div className='Clear' />
      </div>
      <ControllerButton position='down' onClick={props.onKeyDown} />
    </div>
  )
}
