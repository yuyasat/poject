import React from 'react'
import _ from 'lodash'

import GameSetting from '../modules/GameSetting'
import KeyCode from '../modules/KeyCode'

import GridRow from './GridRow'
import Top from './Top'
import Result from './Result'
import NextField from './NextField'
import ControllerButton from './ControllerButton'

import { countColor, deleteColor } from '../modules/Algorithm'
import {
  getMovedFirstColumn, getMovedSecondColumn,
  getRotatedSecondColumn, getRotatedSecondRow
} from '../modules/KeyOperation'

const initialTopState = {
  firstColumn: GameSetting.initialColumn,
  secondColumn: GameSetting.initialColumn,
  firstRow: GameSetting.initialFirstRow,
  secondRow: GameSetting.initialSecondRow,
  firstColor: 0,
  secondColor: 0
}

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

    const topState = Object.assign(initialTopState, {
      firstColor: Math.floor(Math.random() * 4) + 1,
      secondColor: Math.floor(Math.random() * 4) + 1
    })

    const topGridStates = _.times(3, (j) => {
      return(
        _.times(GameSetting.column, (i) => {
          return { color: this.getInitialColor(j, i, topState) }
        })
      )
    })

    const nextState = {
      firstColor: Math.floor(Math.random() * 4) + 1,
      secondColor: Math.floor(Math.random() * 4) + 1
    }

    this.state = {
      gridStates,
      topGridStates,
      topState,
      nextState,
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

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
  }

  getInitialColor(j, i, topState) {
    if (i === GameSetting.initialColumn && j === GameSetting.initialSecondRow) {
      return topState.secondColor
    }
    if (i === GameSetting.initialColumn && j === GameSetting.initialFirstRow) {
      return topState.firstColor
    }
    return 0
  }

  onKeyDown (e) {
    if (e.keyCode === KeyCode.down) {
      this.handleDown()
      return
    }

    const topState = Object.assign(
      {},
      this.state.topState,
      this.getTopState(this.state.topState, e.keyCode)
    )

    this.setState({
      topGridStates: this.getTopGridStates(this.state.topGridStates, topState),
      topState: topState
    })
  }

  getTopState(topState, keyCode) {
    if (keyCode === KeyCode.right) {
      return {
        firstColumn: getMovedFirstColumn(topState, 'right'),
        secondColumn: getMovedSecondColumn(topState, 'right')
      }
    }
    if (keyCode === KeyCode.left) {
      return {
        firstColumn: getMovedFirstColumn(topState, 'left'),
        secondColumn: getMovedSecondColumn(topState, 'left')
      }
    }
    if (keyCode === KeyCode.x || keyCode === KeyCode.up) {
      return {
        secondColumn: getRotatedSecondColumn(topState, 'right'),
        secondRow: getRotatedSecondRow(topState, 'right')
      }
    }
    if (keyCode === KeyCode.z) {
      return {
        secondColumn: getRotatedSecondColumn(topState, 'left'),
        secondRow: getRotatedSecondRow(topState, 'left')
      }
    }
  }

  getTopGridStates(topGridStates, topState) {
    const { firstColumn, firstRow, firstColor, secondColumn, secondRow, secondColor } = topState

    topGridStates = _.times(3, () => {
      return _.times(GameSetting.column, () => { return { color: 0 } })
    })
    topGridStates[firstRow][firstColumn].color = firstColor
    topGridStates[secondRow][secondColumn].color = secondColor

    return topGridStates
  }

  handleDown () {
    const topState = this.state.topState
    const { firstColumn, firstRow, secondColumn, secondRow } = topState

    let newGridStates = this.state.gridStates

    if (firstColumn === secondColumn && newGridStates[0][firstColumn].color !== 0) { return }

    let r1 = GameSetting.row - 1
    let row1 = secondRow === firstRow + 1 ? r1 - 1 : r1
    while (r1 >= 0 && newGridStates[r1][topState.firstColumn].color) {
      row1 = secondRow === firstRow + 1 ? r1 - 2 : r1 - 1
      r1--
    }

    let r2 = GameSetting.row - 1
    let row2 = secondRow === firstRow - 1 ? r2 - 1 : r2
    while (r2 >= 0 && newGridStates[r2][secondColumn].color) {
      row2 = secondRow === firstRow - 1 ? r2 - 2 : r2 - 1
      r2--
    }

    if (row1 >= 0) { newGridStates[row1][firstColumn].color = topState.firstColor }
    if (row2 >= 0) { newGridStates[row2][secondColumn].color = topState.secondColor }

    this.setState({
      gridStates: newGridStates,
      keyAccept: false
    })

    setTimeout(() => {
      this.chain(newGridStates, 0)
    }, 200)

    const nextTopState = Object.assign(initialTopState, {
      firstColor: this.state.nextState.firstColor,
      secondColor: this.state.nextState.secondColor
    })

    const nextWaitingState = {
      firstColor: Math.floor(Math.random() * 4) + 1,
      secondColor: Math.floor(Math.random() * 4) + 1
    }

    this.setState({
      topGridStates: this.getTopGridStates(this.state.topGridStates, nextTopState),
      topState: nextTopState,
      nextState: nextWaitingState,
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
          type='Field'
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
              topGridStates={this.state.topGridStates}
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
