import React from 'react'
import _ from 'lodash'

import GameSetting from '../../modules/GameSetting'
import KeyCode from '../../modules/KeyCode'

import GridRow from '../GridRow'
import Top from '../Top'
import Result from '../Result'
import NextField from '../NextField'
import Controller from '../Controller'

import { countColor, deleteColor, allocateGrids } from '../../modules/Algorithm'
import {
  getMovedFirstColumn, getMovedSecondColumn,
  getRotatedSecondColumn, getRotatedSecondRow
} from '../../modules/KeyOperation'

import './Styles.css'

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
      return (
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
      return (
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
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentDidUpdate () {
    if (this.state.keyAccept) {
      document.addEventListener('keydown', this.handleKeyDown)
    } else {
      document.removeEventListener('keydown', this.handleKeyDown)
    }
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  getInitialColor (j, i, topState) {
    if (i === GameSetting.initialColumn && j === GameSetting.initialSecondRow) {
      return topState.secondColor
    }
    if (i === GameSetting.initialColumn && j === GameSetting.initialFirstRow) {
      return topState.firstColor
    }
    return 0
  }

  handleKeyDown (e) {
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

  getTopState (topState, keyCode) {
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

  getTopGridStates (topGridStates, topState) {
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

    const waitingTopState = Object.assign(initialTopState, {
      firstColor: this.state.nextState.firstColor,
      secondColor: this.state.nextState.secondColor
    })

    const waitingNextState = {
      firstColor: Math.floor(Math.random() * 4) + 1,
      secondColor: Math.floor(Math.random() * 4) + 1
    }

    this.setState({
      topGridStates: this.getTopGridStates(this.state.topGridStates, waitingTopState),
      topState: waitingTopState,
      nextState: waitingNextState
    })
  }

  chain (newGridStates, chainCount) {
    let deletedColor = 0
    newGridStates.forEach((grids, j) => {
      grids.forEach((grid, i) => {
        if (grid.color > 0 && countColor(j, i, newGridStates) >= 4) {
          if (deletedColor === 0 || deletedColor === grid.color) {
            deletedColor = grid.color
            chainCount++
          }
          newGridStates = deleteColor(j, i, newGridStates)
          this.setState({ chainCount: chainCount })
          if (this.state.maxChainCount < chainCount) {
            this.setState({ maxChainCount: chainCount })
          }
        }
      })
    })

    setTimeout(() => {
      // delete
      this.setState({ gridStates: newGridStates })

      setTimeout(() => {
        this.dropGrids(newGridStates, chainCount)
      }, 200)
    }, 200)
    return newGridStates
  }

  dropGrids (newGridStates, chainCount) {
    const { count, gridStates } = allocateGrids(newGridStates)

    this.setState({ gridStates })

    if (count > 0) {
      setTimeout(() => { this.chain(gridStates, chainCount) }, 200)
    } else {
      this.setState({ keyAccept: true })
    }
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
        <div className='FieldWrap'>
          <div className='Field'>
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
        <Controller onKeyDown={this.handleKeyDown} />
      </div>
    )
  }
}
