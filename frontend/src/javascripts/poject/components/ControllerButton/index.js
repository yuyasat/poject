import React from 'react'

import KeyCode from '../../modules/KeyCode'

import './Styles.css'

export default class ControllerButton extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.onClick({ keyCode: KeyCode[this.props.keyName] })
  }

  render () {
    return (
      <div className={`Button${this.props.keyName}`} onClick={this.handleClick} />
    )
  }
}

ControllerButton.propTypes = {
  onClick: React.PropTypes.func,
  position: React.PropTypes.string
}
