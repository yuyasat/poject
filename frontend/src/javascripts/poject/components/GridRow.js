import React from 'react'

import Grid from './Grid'

export default class GridRow extends React.Component {
  style () {
    return {
      display: 'block',
      clear: 'both',
      content: ''
    }
  }

  render () {
    const row = this.props.gridStateRow.map((gridState, i) => {
      return (
        <Grid key={'grid' + i} gridState={gridState} />
      )
    })
    return (
      <div style={this.style()}>
        {row}
      </div>
    )
  }
}
