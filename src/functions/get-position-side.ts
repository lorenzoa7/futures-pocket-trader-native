export function getPositionSide(positionNotional: number) {
  switch (true) {
    case positionNotional > 0:
      return 'LONG'
    case positionNotional < 0:
      return 'SHORT'
    default:
      return 'BOTH'
  }
}
