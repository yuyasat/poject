import GameSetting from './GameSetting'
import Color from './Color'

export function countColor (j, i, gridStates) {
  const { color } = gridStates[j][i]
  let n = 1
  gridStates[j][i].color = Color.none
  if (j - 1 >= 0 && gridStates[j - 1][i].color === color) {
    n += countColor(j - 1, i, gridStates)
  }
  if (j + 1 < GameSetting.row && gridStates[j + 1][i].color === color) {
    n += countColor(j + 1, i, gridStates)
  }
  if (i - 1 >= 0 && gridStates[j][i - 1].color === color) {
    n += countColor(j, i - 1, gridStates)
  }
  if (i + 1 < GameSetting.column && gridStates[j][i + 1].color === color) {
    n += countColor(j, i + 1, gridStates)
  }
  gridStates[j][i].color = color
  return n
}

export function deleteColor (j, i, gridStates) {
  const { color } = gridStates[j][i]
  gridStates[j][i].color = Color.none
  if (j - 1 >= 0 && gridStates[j - 1][i].color === color) {
    deleteColor(j - 1, i, gridStates)
  }
  if (j + 1 < GameSetting.row && gridStates[j + 1][i].color === color) {
    deleteColor(j + 1, i, gridStates)
  }
  if (i - 1 >= 0 && gridStates[j][i - 1].color === color) {
    deleteColor(j, i - 1, gridStates)
  }
  if (i + 1 < GameSetting.column && gridStates[j][i + 1].color === color) {
    deleteColor(j, i + 1, gridStates)
  }
  return gridStates
}

export function allocateGrids (gridStates) {
  let count = 0
  for (let i = 0; i < gridStates[0].length; i++) {
    let spaces = 0
    for (let j = gridStates.length - 1; j >= 0; j--) {
      if (!gridStates[j][i].color) {
        spaces++
      } else if (spaces > 0) {
        gridStates[j + spaces][i].color = gridStates[j][i].color
        gridStates[j][i].color = Color.none
        count++
      }
    }
  }
  return { count, gridStates }
}
