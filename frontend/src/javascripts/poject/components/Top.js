import React from 'react'

import TopGrid from './TopGrid'

export default class Top extends React.Component {
  constructor (props) {
    super(props)
    this.state = this.props.topState
  }

  styles () {
    return ({
      defaultStyle: {
        height: '42px',
        white_space: 'pre-wrap'
      }
    })
  }

  componentWillReceiveProps (newProps) {
    if (newProps.keyAccept) {
      this.state = newProps.topState
    } else {
      this.setState({ color1: 0, color2: 0 })
    }
  }

  render () {
    const key = new Date().getTime()

    return (
      <div style={this.styles().defaultStyle}>
        <TopGrid key={'1' + key} topGridState={this.state} position='1' />
        <TopGrid key={'2' + key} topGridState={this.state} position='2' />
      </div>
    )
  }
}
