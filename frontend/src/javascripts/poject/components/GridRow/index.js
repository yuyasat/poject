import React from 'react'

import Grid from '../Grid'

import './Styles.css'

export default function GridRow (props) {
  const row = props.gridStateRow.map((gridState, i) => {
    return (
      <Grid
        key={'grid' + i}
        type={props.type}
        gridState={gridState} />
    )
  })

  return (
    <div className='GridRow'>
      {row}
    </div>
  )
}

GridRow.propTypes = {
  gridStateRow: React.PropTypes.array,
  type: React.PropTypes.string
}
