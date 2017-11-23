import React from 'react'

import './Styles.css'

export default function Result (props) {
  const Result = {
    float: 'left',
  }
  return (
    <div className='Result'>
      <div>連鎖数: {props.chainCount}</div>
      <div>最大連鎖数: {props.maxChainCount}</div>
    </div>
  )
}

Result.propTypes = {
  chainCount: React.PropTypes.number,
  maxChainCount: React.PropTypes.number
}
