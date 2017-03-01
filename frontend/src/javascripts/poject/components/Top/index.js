import React from 'react'

import GridRow from '../GridRow'

import './Styles.css'

export default function Top (props) {
  const gridRows = props.topGridStates.map((gridStateRow, j) => {
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

Top.propTypes = {
  topGridStates: React.PropTypes.array
}
