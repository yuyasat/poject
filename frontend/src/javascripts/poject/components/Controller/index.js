import React from 'react'

import ControllerButton from '../ControllerButton'

import './Styles.css'

export default function Controller (props) {
  return (
    <div>
      <div className='ControllerButtomWrap'>
        <ControllerButton position='Left' onClick={props.onKeyDown} />
        <ControllerButton position='Right' onClick={props.onKeyDown} />
        <ControllerButton position='X' onClick={props.onKeyDown} />
        <ControllerButton position='Z' onClick={props.onKeyDown} />
        <div className='Clear' />
      </div>
      <ControllerButton position='Down' onClick={props.onKeyDown} />
    </div>
  )
}

Controller.propTypes = {
  onKeyDown: React.PropTypes.func
}
