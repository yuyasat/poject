import React from 'react';

export default class Result extends React.Component {
  style() {
    return({
      defaultStyle: {
        float: 'left',
        width: '100px',
      },
    })
  }

  render() {
    const chainCount = this.props.chainCount;
    const maxChainCount = this.props.maxChainCount;

    return(
      <div style={this.style().defaultStyle}>
        <div>連鎖数: {chainCount}</div>
        <div>最大連鎖数: {maxChainCount}</div>
      </div>
    )
  }
}
