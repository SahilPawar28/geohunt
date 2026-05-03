// Haversine formula — calculates distance between 2 coordinates in km
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Score: 5000 if perfect, 0 if 5000km+ away
export function calculateScore(distanceKm) {
  if (distanceKm <= 0.05) return 5000
  const score = Math.round(5000 * Math.exp(-distanceKm / 2000))
  return Math.max(0, score)
}

export function getScoreLabel(score) {
  if (score >= 4500) return { label: 'Perfect!', color: '#43e97b' }
  if (score >= 3000) return { label: 'Great!', color: '#38f9d7' }
  if (score >= 1500) return { label: 'Good', color: '#667eea' }
  if (score >= 500)  return { label: 'Not bad', color: '#f7971e' }
  return { label: 'Keep practicing!', color: '#ff6b6b' }
}
