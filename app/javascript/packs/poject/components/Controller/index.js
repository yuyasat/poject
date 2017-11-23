import React from 'react'

import ControllerButton from '../ControllerButton'

import './Styles.css'

export default function Controller (props) {
  return (
    <div>
      <div className='ControllerButtomWrap'>
        <ControllerButton keyName='Left' onClick={props.onKeyDown} />
        <ControllerButton keyName='Right' onClick={props.onKeyDown} />
        <ControllerButton keyName='X' onClick={props.onKeyDown} />
        <ControllerButton keyName='Z' onClick={props.onKeyDown} />
        <div className='Clear' />
      </div>
      <ControllerButton keyName='Down' onClick={props.onKeyDown} />
    </div>
  )
}

Controller.propTypes = {
  onKeyDown: React.PropTypes.func
}
