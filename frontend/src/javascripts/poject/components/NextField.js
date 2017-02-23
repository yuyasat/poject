import React from 'react'

import Grid from './Grid'

export default class NextField extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      color1: this.props.nextState.color1,
      color2: this.props.nextState.color2
    }
  }

  componentWillReceiveProps (newProps) {
    this.state = newProps.nextState
  }

  style () {
    return ({
      defaultStyle: {
        height: '100px'
      }
    })
  }

  render () {
    return (
      <div style={this.style().defaultStyle}>
        Next<br />
        <Grid key='next2' gridState={{ j: '0', i: '1', color: this.state.color2 }} /><br />
        <Grid key='next1' gridState={{ j: '1', i: '1', color: this.state.color1 }} />
      </div>
    )
  }
}
