import React from 'react'

import Grid from '../Grid'

import './Styles.css'

export default function NextField (props) {
  const { firstColor, secondColor } = props.nextState

  return (
    <div className='NextField'>
      Next{props.nextNum}
      <Grid gridState={{ color: secondColor }} /><br />
      <Grid gridState={{ color: firstColor }} />
    </div>
  )
}

NextField.propTypes = {
  nextNum: React.PropTypes.number,
  nextState: React.PropTypes.shape({
    firstColor: React.PropTypes.number,
    secondColor: React.PropTypes.number
  })
}
