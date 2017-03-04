import React from 'react'

import KeyCode from '../../modules/KeyCode'

import './Styles.css'

export default class ControllerButton extends React.Component {
  static propTypes = {
    onClick: React.PropTypes.func,
    keyName: React.PropTypes.string
  }

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.onClick({ keyCode: KeyCode[this.props.keyName.toLowerCase()] })
  }

  render () {
    return (
      <div className={`Button${this.props.keyName}`} onClick={this.handleClick} />
    )
  }
}
