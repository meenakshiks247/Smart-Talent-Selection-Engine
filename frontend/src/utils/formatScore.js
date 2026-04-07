export function formatScore(score) {
  const numericScore = Number(score)
  if (Number.isNaN(numericScore)) {
    return '0.00'
  }
  return `${numericScore.toFixed(2)} / 100`
}