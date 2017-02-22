import React from 'react'
import ReactDom from 'react-dom'

import Grid from './poject_grid'

export default class GridRow extends React.Component {
  style () {
    return {
      display: 'block',
      clear: 'both',
      content: ''
    }
  }

  render () {
    const row = this.props.gridStateRow.map((gridState) => {
      return (
        <Grid
          key={'grid' + gridState.i + gridState.j}
          gridState={gridState} />
      )
    })
    return (
      <div style={this.style()}>
        {row}
      </div>
    )
  }
}
