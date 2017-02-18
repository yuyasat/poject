import React from 'react';
import ReactDom from 'react-dom';

import Grid from './poject_grid';

export default class GridRow extends React.Component {
  constructor(props) {
    super(props);
    this.onClickGrid = this.onClickGrid.bind(this);
  }
  style() {
    return {
      display: 'block',
      clear: 'both',
      content: '',
    }
  }
  onClickGrid(gridState) {
    this.props.handleClickGrid(gridState);
  }

  render() {
    const row = this.props.gridStateRow.map((gridState) => {
      return(
        <Grid
          key={'grid' + gridState.i + gridState.j}
          gridState={gridState}
          gridStates={this.props.gridStates}
          onClickGrid={this.onClickGrid} />
      )
    });
    return(
      <div style={this.style()}>
        {row}
      </div>
    )
  }
}
