import React from 'react'

import GridRow from '../GridRow'

import './Styles.css'

export default class Top extends React.Component {
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

Top.propTypes = {
  topGridStates: React.PropTypes.array
}
