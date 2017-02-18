import React from 'react';

export default class Result extends React.Component {
  render() {
    const chainCount = this.props.chainCount;
    const maxChainCount = this.props.maxChainCount;

    return(
      <div>
        連鎖数: {chainCount}, 最大連鎖数: {maxChainCount}
      </div>
    )
  }
}
