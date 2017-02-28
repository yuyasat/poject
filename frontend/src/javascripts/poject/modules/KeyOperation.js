import Setting from './GameSetting'

export function getMovedFirstColumn (topState, move) {
  const { firstColumn } = topState

  if (isValidMove(topState, move)) {
    return { right: firstColumn + 1, left: firstColumn - 1 }[move]
  }
  return firstColumn
}

export function getMovedSecondColumn (topState, move) {
  const { secondColumn } = topState

  if (isValidMove(topState, move)) {
    return { right: secondColumn + 1, left: secondColumn - 1 }[move]
  }
  return secondColumn
}

function isValidMove (topState, move) {
  const { firstColumn, secondColumn } = topState

  if (move === 'left') {
    if (firstColumn === 0) { return false }
    if (firstColumn === 1 && secondColumn === 0) { return false }
  }
  if (move === 'right') {
    if (firstColumn === Setting.column - 1) { return false }
    if (firstColumn === Setting.column - 2 && secondColumn === Setting.column - 1) {
      return false
    }
  }
  return true
}

export function getRotatedSecondColumn (topState, rotation) {
  const { firstColumn, firstRow, secondColumn, secondRow } = topState

  if (!isValidRotation(topState, rotation)) { return secondColumn }

  if (secondColumn === firstColumn && secondRow === firstRow - 1) {
    return { right: firstColumn + 1, left: firstColumn - 1 }[rotation]
  }
  if (secondColumn === firstColumn && secondRow === firstRow + 1) {
    return { right: firstColumn - 1, left: firstColumn + 1 }[rotation]
  }
  return firstColumn
}

export function getRotatedSecondRow (topState, rotation) {
  const { firstColumn, firstRow, secondColumn, secondRow } = topState

  if (!isValidRotation(topState, rotation)) { return secondRow }

  if (secondRow === firstRow && secondColumn === firstColumn - 1) {
    return { right: firstRow - 1, left: firstRow + 1 }[rotation]
  }
  if (secondRow === firstRow && secondColumn === firstColumn + 1) {
    return { right: firstRow + 1, left: firstRow - 1 }[rotation]
  }
  return firstRow
}

function isValidRotation (topState, rotation) {
  const { firstColumn, secondRow } = topState

  if (rotation === 'left') {
    if (firstColumn === 0 && secondRow === 0) { return false }
    if (firstColumn === Setting.column - 1 && secondRow === 2) { return false }
  }
  if (rotation === 'right') {
    if (firstColumn === 0 && secondRow === 2) { return false }
    if (firstColumn === Setting.column - 1 && secondRow === 0) { return false }
  }
  return true
}
