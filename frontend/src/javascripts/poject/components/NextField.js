import React from 'react'

import Grid from './Grid'

export default class NextField extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      firstColor: this.props.nextState.firstColor,
      secondColor: this.props.nextState.secondColor
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
        <Grid gridState={{ j: '0', i: '1', color: this.state.secondColor }} /><br />
        <Grid gridState={{ j: '1', i: '1', color: this.state.firstColor }} />
      </div>
    )
  }
}
