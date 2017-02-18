import React from 'react';
import ReactDom from 'react-dom';

import GridRow from './poject_grid_row';
import Top from './poject_top';
import Result from './poject_result';

export default class Field extends React.Component {
  // TODO: Keep the color number as static variable.
  // 1: red, 2: blue, 3: green, 4: yellow
  constructor(props) {
    super(props);

    const row = 11
    const column = 7
    const gridStates = Array.from(Array(row).keys()).map((index_j) => {
      return(
        Array.from(Array(column).keys()).map((index_i) => {
          return { color: 0, i: index_i, j: index_j }
        })
      )
    });
    const topState = {
      column: 2,
      position: 1, // 0: 右, 1: 上, 2: 左, 3: 下
      color1: Math.floor(Math.random() * 4) + 1,
      color2: Math.floor(Math.random() * 4) + 1,
    }

    this.row = row;
    this.column = column;

    this.state = {
      gridStates: gridStates,
      topState: topState,
      chainCount: 0,
      maxChainCount: 0,
      keyAccept: true,
    }

    this.handleDown = this.handleDown.bind(this);
  }

  countColor(j, i, gridStates) {
    const color = gridStates[j][i].color;
    let n = 1;
    gridStates[j][i].color = 0;
    if(j - 1 >= 0 && gridStates[j - 1][i].color === color) {
      n += this.countColor(j - 1, i, gridStates)
    }
    if(j + 1 < this.row && gridStates[j + 1][i].color === color) {
      n += this.countColor(j + 1, i, gridStates)
    }
    if(i - 1 >= 0 && gridStates[j][i - 1].color === color) {
      n += this.countColor(j, i - 1, gridStates)
    }
    if(i + 1 < this.column && gridStates[j][i + 1].color === color) {
      n += this.countColor(j, i + 1, gridStates)
    }
    gridStates[j][i].color = color;
    return n;
  }

  deleteColor(j, i, gridStates) {
    const color = gridStates[j][i].color;
    gridStates[j][i].color = 0;
    if(j - 1 >= 0 && gridStates[j - 1][i].color === color) {
      this.deleteColor(j - 1, i, gridStates)
    }
    if(j + 1 < this.row && gridStates[j + 1][i].color === color) {
      this.deleteColor(j + 1, i, gridStates)
    }
    if(i - 1 >= 0 && gridStates[j][i - 1].color === color) {
      this.deleteColor(j, i - 1, gridStates)
    }
    if(i + 1 < this.column && gridStates[j][i + 1].color === color) {
      this.deleteColor(j, i + 1, gridStates)
    }
    return gridStates;
  }

  handleDown(state) {
    let newGridStates = this.state.gridStates;
    // set the second grid column
    let column2;
    if(state.position === 0) {
      column2 = state.column + 1
    } else if(state.position === 2) {
      column2 = state.column - 1
    } else {
      column2 = state.column
    }

    if(state.column === column2 && newGridStates[0][state.column].color !== 0) { return }

    let r1 = this.row - 1;
    let row1 = state.position === 3 ? r1 - 1 : r1; // 3 means lower
    while(r1 >= 0 && newGridStates[r1][state.column].color) {
      row1 = state.position === 3 ? r1 - 2 : r1 - 1;
      r1--;
    }

    let r2 = this.row - 1;
    let row2 = state.position === 1 ? r2 - 1 : r2; // 1 means upper
    while(r2 >= 0 && newGridStates[r2][column2].color) {
      row2 = state.position === 1 ? r2 - 2 : r2 - 1;
      r2--;
    }

    if(row1 >= 0) { newGridStates[row1][state.column].color = state.color1 }
    if(row2 >= 0) { newGridStates[row2][column2].color = state.color2 }
    this.setState({ gridStates: newGridStates, keyAccept: false });

    setTimeout(() => {
      this.chain(newGridStates, 0);
    }, 200);

    const nextTopState = Object.assign(this.state.topState, {
      color1: Math.floor(Math.random() * 4) + 1,
      color2: Math.floor(Math.random() * 4) + 1,
    });
    this.setState({ topState: nextTopState });
  }

  chain(newGridStates, chainCount) {
    let updatedGridStates = newGridStates;
    let deletedColor = 0;
    for(let j = 0; j < newGridStates.length; j++) {
      for(let i = 0; i < newGridStates[0].length; i++) {
        if(newGridStates[j][i].color > 0 && this.countColor(j, i, newGridStates) >= 4) {
          if(deletedColor === 0 || deletedColor === newGridStates[j][i].color) {
            deletedColor = newGridStates[j][i].color;
            chainCount++;
          }
          updatedGridStates = this.deleteColor(j, i, newGridStates);
          this.setState({ chainCount: chainCount });
          if(this.state.maxChainCount < chainCount) {
            this.setState({ maxChainCount: chainCount });
          }
        }
      }
    }

    // setTimeout(function() { "do something" }.bind(this), 300); equals
    // setTimeout(() => { "do something" }, 300);
    setTimeout(() => {
      // delete
      this.setState({ gridStates: updatedGridStates });

      setTimeout(() => {
        const allocatedGridsWithCount = this.allocateGrids(updatedGridStates);
        const count = allocatedGridsWithCount.count;
        updatedGridStates = allocatedGridsWithCount.gridStates;

        // drop
        this.setState({ gridStates: updatedGridStates });

        setTimeout(() => {
          if(count > 0) {
            this.chain(updatedGridStates, chainCount);
          } else {
            this.setState({ keyAccept: true });
          }
        }, 200);
      }, 200);
    }, 200);
    return updatedGridStates;
  }

  allocateGrids(gridStates) {
    let newGridStates = gridStates;
    let count = 0;
    for(let i = 0; i < gridStates[0].length; i++) {
      let spaces = 0;
      for(let j = gridStates.length - 1; j >= 0; j--) {
        if(!newGridStates[j][i].color) {
          spaces++;
        } else if(spaces > 0) {
          newGridStates[j + spaces][i].color = newGridStates[j][i].color;
          newGridStates[j][i].color = 0;
          count++;
        }
      }
    }
    return { count: count, gridStates: newGridStates };
  }

  style() {
    return({ height: '320px', width: '350px' })
  }

  render() {
    const grids = this.state.gridStates.map((gridStateRow, index_j) => {
      return(
        <GridRow
          key={'row' + index_j}
          gridStateRow={gridStateRow} />
      )
    });
    return(
      <div>
        <div style={this.style()}>
          <Top
            handleDown={this.handleDown}
            topState={this.state.topState}
            keyAccept={this.state.keyAccept} />
          {grids}
        </div>
        <Result chainCount={this.state.chainCount} maxChainCount={this.state.maxChainCount} />
        <div>
          <h3>遊び方</h3>
          ←: 左に動かす，
          →: 右に動かす，
          ↑,x: 右回転する，
          z: 左回転する，
          ↓: 落下させる
        </div>
        <div>
          <h3>説明</h3>
          同じ色を４つつなげると消えるゲームをReact.jsで実装したものです。
        </div>
      </div>
    )
  }
}
