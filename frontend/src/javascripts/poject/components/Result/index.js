import React from 'react'

export default function Result (props) {
  return (
    <div className='NextField'>
      <div>連鎖数: {props.chainCount}</div>
      <div>最大連鎖数: {props.maxChainCount}</div>
    </div>
  )
}

Result.propTypes = {
  chainCount: React.PropTypes.number,
  maxChainCount: React.PropTypes.number
}
