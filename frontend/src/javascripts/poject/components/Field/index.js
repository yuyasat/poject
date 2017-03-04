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

    const gridStates = _.times(GameSetting.row, () =>
      _.times(GameSetting.column, () => ({
        color: Color.none
      }))
    )

    const topState = Object.assign(initialTopState, {
      firstColor: Math.floor(Math.random() * 4) + 1,
      secondColor: Math.floor(Math.random() * 4) + 1
    })

    const topGridStates = _.times(GameSetting.topFieldRow, (j) =>
      _.times(GameSetting.column, (i) => ({
        color: this.getInitialColor(j, i, topState)
      }))
    )

    const nextState = {
      firstColor: Math.floor(Math.random() * 4) + 1,
      secondColor: Math.floor(Math.random() * 4) + 1
    }

    const nextNextState = {
      firstColor: Math.floor(Math.random() * 4) + 1,
      secondColor: Math.floor(Math.random() * 4) + 1
    }

    this.state = {
      gridStates,
      topGridStates,
      topState,
      nextState,
      nextNextState,
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
      topGridStates: this.getTopGridStates(topState),
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

  getTopGridStates (topState) {
    const { firstColumn, firstRow, firstColor, secondColumn, secondRow, secondColor } = topState

    let topGridStates = _.times(GameSetting.topFieldRow, () =>
      _.times(GameSetting.column, () => ({
        color: Color.none
      }))
    )

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
      firstColor: this.state.nextNextState.firstColor,
      secondColor: this.state.nextNextState.secondColor
    }

    const waitingNextNextState = {
      firstColor: Math.floor(Math.random() * 4) + 1,
      secondColor: Math.floor(Math.random() * 4) + 1
    }

    this.setState({
      topGridStates: this.getTopGridStates(waitingTopState),
      topState: waitingTopState,
      nextState: waitingNextState,
      nextNextState: waitingNextNextState
    })
  }

  chain (chainedGridStates, chainCount) {
    const {
      gridStates, countedChainCount
    } = this.getDeletedGridStates(chainedGridStates, chainCount)

    chainCount = countedChainCount

    setTimeout(() => {
      this.setState({ gridStates })

      setTimeout(() => {
        this.dropGrids(gridStates, chainCount)
      }, 200)
    }, 200)

    return gridStates
  }

  getDeletedGridStates (gridStates, chainCount) {
    let deletedColor = Color.none
    gridStates.forEach((grids, j) => {
      grids.forEach((grid, i) => {
        if (grid.color !== Color.none && countColor(j, i, gridStates) >= 4) {
          if (deletedColor === Color.none || deletedColor === grid.color) {
            deletedColor = grid.color
            chainCount++
          }
          gridStates = deleteColor(j, i, gridStates)
          this.setState({ chainCount: chainCount })
          if (this.state.maxChainCount < chainCount) {
            this.setState({ maxChainCount: chainCount })
          }
        }
      })
    })

    return { gridStates, countedChainCount: chainCount }
  }

  dropGrids (deletedGridStates, chainCount) {
    const { count, gridStates } = allocateGrids(deletedGridStates)

    this.setState({ gridStates })

    if (count > 0) {
      setTimeout(() => { this.chain(gridStates, chainCount) }, 200)
    } else {
      this.setState({ keyAccept: true })
    }
  }

  styles () {
    return {
      fieldWrap: {
        width: `${(GameSetting.column * 30) + 200}px`,
        height: `${(GameSetting.row * 20) + 140}px`
      },
      field: {
        width: `${(GameSetting.column * 30) + 50}px`
      }
    }
  }

  render () {
    const grids = this.state.gridStates.map((gridStateRow, j) => {
      return (
        <GridRow
          key={`row${j}`}
          type='Field'
          gridStateRow={gridStateRow} />
      )
    })
    return (
      <div>
        <div className='FieldWrap' style={this.styles().fieldWrap}>
          <div className='Field' style={this.styles().field}>
            <Top
              handleDown={this.handleDown}
              topState={this.state.topState}
              topGridStates={this.state.topGridStates}
              keyAccept={this.state.keyAccept} />
            {grids}
          </div>
          <NextField nextNum='1' nextState={this.state.nextState} />
          <NextField nextNum='2' nextState={this.state.nextNextState} />
          <Result chainCount={this.state.chainCount} maxChainCount={this.state.maxChainCount} />
        </div>
        <Controller onKeyDown={this.handleKeyDown} />
      </div>
    )
  }
}
