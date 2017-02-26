import React from 'react'

import Grid from '../Grid'

import './Styles.css'

export default class GridRow extends React.Component {
  render () {
    const row = this.props.gridStateRow.map((gridState, i) => {
      return (
        <Grid key={'grid' + i} gridState={gridState} />
      )
    })
    return (
      <div className="GridRow">
        {row}
      </div>
    )
  }
}
