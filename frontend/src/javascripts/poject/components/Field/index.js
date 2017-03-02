import React from 'react'
import _ from 'lodash'

import GameSetting from '../../modules/GameSetting'
import KeyCode from '../../modules/KeyCode'
import Color from '../../modules/Color'

import GridRow from '../GridRow'
import Top from '../Top'
import Result from '../Result'
import NextField from '../NextField'
import Controller from '../Controller'

import {
  getDropedGridStates, isColumnFilled,
  countColor, deleteColor, allocateGrids
} from '../../modules/Algorithm'
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
  firstColor: Color.none,
  secondColor: Color.none
}

export default class Field extends React.Component {
  constructor (props) {
    super(props)

    const gridStates = _.times(GameSetting.row, () => {
      return (
        _.times(GameSetting.column, () => {
          return { color: Color.none }
        })
      )
    })

    const topState = Object.assign(initialTopState, {
      firstColor: Math.floor(Math.random() * 4) + 1,
      secondColor: Math.floor(Math.random() * 4) + 1
    })

    const topGridStates = _.times(GameSetting.topFieldRow, (j) => {
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
    return Color.none
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
      topState
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

    topGridStates = _.times(GameSetting.topFieldRow, () => {
      return _.times(GameSetting.column, () => { return { color: Color.none } })
    })
    topGridStates[firstRow][firstColumn].color = firstColor
    topGridStates[secondRow][secondColumn].color = secondColor

    return topGridStates
  }

  handleDown () {
    if (isColumnFilled(this.state.gridStates, this.state.topState)) { return }

    const gridStates = getDropedGridStates(this.state.gridStates, this.state.topState)

    this.setState({
      gridStates,
      keyAccept: false
    })

    setTimeout(() => {
      this.chain(gridStates, 0)
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
    let deletedColor = Color.none
    newGridStates.forEach((grids, j) => {
      grids.forEach((grid, i) => {
        if (grid.color !== Color.none && countColor(j, i, newGridStates) >= 4) {
          if (deletedColor === Color.none || deletedColor === grid.color) {
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
