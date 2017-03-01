import React from 'react'

import KeyCode from '../../modules/KeyCode'

import './Styles.css'

export default class ControllerButton extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.onClick({ keyCode: KeyCode[this.props.position] })
  }

  render () {
    const position = this.props.position
    const className = `Button${position.charAt(0).toUpperCase() + position.slice(1)}`
    return (
      <div className={className} onClick={this.handleClick} />
    )
  }
}

ControllerButton.propTypes = {
  onClick: React.PropTypes.func,
  position: React.PropTypes.string
}
