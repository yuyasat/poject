import GameSetting from './GameSetting'

export function countColor (j, i, gridStates) {
  const color = gridStates[j][i].color
  let n = 1
  gridStates[j][i].color = 0
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
  const color = gridStates[j][i].color
  gridStates[j][i].color = 0
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
