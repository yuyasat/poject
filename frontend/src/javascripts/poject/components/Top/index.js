import React from 'react'

import GridRow from '../GridRow'

import './Styles.css'

export default class Top extends React.Component {
  constructor (props) {
    super(props)
    this.state = this.props.topState
  }

  componentWillReceiveProps (newProps) {
    if (newProps.keyAccept) {
      this.state = newProps.topState
    } else {
      this.setState({ color1: 0, color2: 0 })
    }
  }

  render () {
    const gridRows = this.props.topGridStates.map((gridStateRow, j) => {
      return (
        <GridRow
          key={'row' + j}
          type='Top'
          gridStateRow={gridStateRow} />
      )
    })
    return (
      <div className='TopField'>
        {gridRows}
      </div>
    )
  }
}
