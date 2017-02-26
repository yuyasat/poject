import React from 'react'
import _ from 'lodash'

import GameSetting, { Position } from '../modules/GameSetting'
import KeyCode from '../modules/KeyCode'

import GridRow from './GridRow'
import Top from './Top'
import Result from './Result'
import NextField from './NextField'
import ControllerButton from './ControllerButton'

import { countColor, deleteColor } from '../modules/Algorithm'

export default class Field extends React.Component {
  // TODO: Keep the color number as static variable.
  // 1: red, 2: blue, 3: green, 4: yellow
  constructor (props) {
    super(props)

    const gridStates = _.times(GameSetting.row, (j) => {
      return(
        _.times(GameSetting.column, (i) => {
          return { color: 0 }
        })
      )
    })

    const topState = {
      column: GameSetting.initialColumn,
      position: GameSetting.initialPosition,
      color1: Math.floor(Math.random() * 4) + 1,
      color2: Math.floor(Math.random() * 4) + 1
    }
    const nextState = {
      color1: Math.floor(Math.random() * 4) + 1,
      color2: Math.floor(Math.random() * 4) + 1
    }

    this.state = {
      gridStates: gridStates,
      topState: topState,
      nextState: nextState,
      chainCount: 0,
      maxChainCount: 0,
      keyAccept: true
    }

    this.handleDown = this.handleDown.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  componentDidUpdate () {
    if (this.state.keyAccept) {
      document.addEventListener('keydown', this.onKeyDown)
    } else {
      document.removeEventListener('keydown', this.onKeyDown)
    }
  }

  componentDidMount () {
    document.addEventListener('keydown', this.onKeyDown)
  }

  onKeyDown (e) {
    const column = this.state.topState.column
    const position = this.state.topState.position

    let topState = this.state.topState

    if (e.keyCode === KeyCode.down) {
      this.handleDown()
      return
    }

    if (e.keyCode === KeyCode.right && column < GameSetting.column) {
      if (column === GameSetting.column - 1 ||
          (position === GameSetting.right && column === GameSetting.column - 2)) { return }
      topState.column = column + 1
    } else if (e.keyCode === KeyCode.left && column > 0) {
      if (column === 0 || (position === Position.left && column === 1)) { return }
      topState.column = column - 1
    } else if (e.keyCode === KeyCode.x || e.keyCode === KeyCode.up) {
      if ((position === Position.down && column === 0) ||
          (position === Position.up && column === GameSetting.column - 1)) { return }
      topState.position = position === Position.right ? Position.down : position - 1
    } else if (e.keyCode === KeyCode.z) {
      if ((position === Position.down && column === GameSetting.column - 1) ||
          position === Position.up && column === 0) { return }
      topState.position = position === Position.down ? Position.up : position + 1
    }
    this.setState({ topState: topState })
  }



  handleDown () {
    const state = this.state.topState

    let newGridStates = this.state.gridStates
    // set the second grid column
    let column2
    if (state.position === Position.right) {
      column2 = state.column + 1
    } else if (state.position === Position.left) {
      column2 = state.column - 1
    } else {
      column2 = state.column
    }

    if (state.column === column2 && newGridStates[0][state.column].color !== 0) { return }

    let r1 = GameSetting.row - 1
    let row1 = state.position === Position.down ? r1 - 1 : r1 // 3 means lower
    while (r1 >= 0 && newGridStates[r1][state.column].color) {
      row1 = state.position === Position.down ? r1 - 2 : r1 - 1
      r1--
    }

    let r2 = GameSetting.row - 1
    let row2 = state.position === Position.up ? r2 - 1 : r2 // 1 means upper
    while (r2 >= 0 && newGridStates[r2][column2].color) {
      row2 = state.position === Position.up ? r2 - 2 : r2 - 1
      r2--
    }

    if (row1 >= 0) { newGridStates[row1][state.column].color = state.color1 }
    if (row2 >= 0) { newGridStates[row2][column2].color = state.color2 }
    this.setState({ gridStates: newGridStates, keyAccept: false })

    setTimeout(() => {
      this.chain(newGridStates, 0)
    }, 200)

    const nextTopState = Object.assign(this.state.topState, {
      column: GameSetting.initialColumn, position: GameSetting.initialPosition,
      color1: this.state.nextState.color1, color2: this.state.nextState.color2
    })
    const nextWaitingState = {
      color1: Math.floor(Math.random() * 4) + 1, color2: Math.floor(Math.random() * 4) + 1
    }
    this.setState({
      topState: nextTopState,
      nextState: nextWaitingState
    })
  }

  chain (newGridStates, chainCount) {
    let updatedGridStates = newGridStates
    let deletedColor = 0
    for (let j = 0; j < newGridStates.length; j++) {
      for (let i = 0; i < newGridStates[0].length; i++) {
        if (newGridStates[j][i].color > 0 && countColor(j, i, newGridStates) >= 4) {
          if (deletedColor === 0 || deletedColor === newGridStates[j][i].color) {
            deletedColor = newGridStates[j][i].color
            chainCount++
          }
          updatedGridStates = deleteColor(j, i, newGridStates)
          this.setState({ chainCount: chainCount })
          if (this.state.maxChainCount < chainCount) {
            this.setState({ maxChainCount: chainCount })
          }
        }
      }
    }

    // setTimeout(function() { "do something" }.bind(this), 300); equals
    // setTimeout(() => { "do something" }, 300);
    setTimeout(() => {
      // delete
      this.setState({ gridStates: updatedGridStates })

      setTimeout(() => {
        const allocatedGridsWithCount = this.allocateGrids(updatedGridStates)
        const count = allocatedGridsWithCount.count
        updatedGridStates = allocatedGridsWithCount.gridStates

        // drop
        this.setState({ gridStates: updatedGridStates })

        if (count > 0) {
          setTimeout(() => { this.chain(updatedGridStates, chainCount) }, 250)
        } else {
          setTimeout(() => { this.setState({ keyAccept: true }) }, 50)
        }
      }, 200)
    }, 200)
    return updatedGridStates
  }

  allocateGrids (gridStates) {
    let newGridStates = gridStates
    let count = 0
    for (let i = 0; i < gridStates[0].length; i++) {
      let spaces = 0
      for (let j = gridStates.length - 1; j >= 0; j--) {
        if (!newGridStates[j][i].color) {
          spaces++
        } else if (spaces > 0) {
          newGridStates[j + spaces][i].color = newGridStates[j][i].color
          newGridStates[j][i].color = 0
          count++
        }
      }
    }
    return { count: count, gridStates: newGridStates }
  }

  style () {
    return ({
      fieldWrap: {
        width: '420px',
        height: '300px',
        display: 'block',
        clear: 'both',
        content: ''
      },
      field: {
        float: 'left',
        height: '300px',
        width: '260px'
      },
      clear: {
        clear: 'both',
        height: '10px'
      },
      controllerButtomWrap: {
        width: '220px',
        height: '35px'
      }
    })
  }

  render () {
    const grids = this.state.gridStates.map((gridStateRow, j) => {
      return (
        <GridRow
          key={'row' + j}
          gridStateRow={gridStateRow} />
      )
    })
    return (
      <div>
        <div style={this.style().fieldWrap}>
          <div style={this.style().field}>
            <Top
              handleDown={this.handleDown}
              topState={this.state.topState}
              keyAccept={this.state.keyAccept} />
            {grids}
          </div>
          <NextField nextState={this.state.nextState} />
          <Result chainCount={this.state.chainCount} maxChainCount={this.state.maxChainCount} />
        </div>
        <div style={this.style().controllerButtomWrap}>
          <ControllerButton position='left' handleLeft={this.onKeyDown} />
          <ControllerButton position='right' handleRight={this.onKeyDown} />
          <ControllerButton position='b' handleB={this.onKeyDown} />
          <ControllerButton position='y' handleY={this.onKeyDown} />
          <div style={this.style().clear} />
        </div>
        <ControllerButton position='down' handleDown={this.onKeyDown} />
      </div>
    )
  }
}
