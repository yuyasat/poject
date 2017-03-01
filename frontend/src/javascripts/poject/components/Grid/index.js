import React from 'react'

import './Styles.css'

export default function Grid (props) {
  const colorName = props.gridState.color === 0 ? '' : `Grid${props.gridState.color}`

  return (
    <div className={`Grid ${colorName} ${props.type}Grid`} />
  )
}

Grid.propTypes = {
  gridState: React.PropTypes.shape({
    color: React.PropTypes.number
  }),
  type: React.PropTypes.string
}
