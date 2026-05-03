import { db } from './config'
import {
  doc, setDoc, getDoc, updateDoc,
  onSnapshot, collection
} from 'firebase/firestore'
import { getRandomMapillaryImage } from '../utils/mapillary'

// Generate a random 6-character room code
export function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

// Create a new room (admin)
export async function createRoom(playerName) {
  const code = generateRoomCode()
  const image = await getRandomMapillaryImage()

  await setDoc(doc(db, 'rooms', code), {
    code,
    admin: playerName,
    players: [playerName],
    currentImage: image,
    gameState: 'waiting', // waiting | playing | result
    guess: null,
    round: 1,
    totalScore: 0,
    createdAt: Date.now(),
  })

  return code
}

// Join existing room
export async function joinRoom(code, playerName) {
  const ref = doc(db, 'rooms', code.toUpperCase())
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error('Room not found!')

  const data = snap.data()
  if (!data.players.includes(playerName)) {
    await updateDoc(ref, {
      players: [...data.players, playerName]
    })
  }

  return data
}

// Start the game (admin only)
export async function startGame(code) {
  await updateDoc(doc(db, 'rooms', code), {
    gameState: 'playing'
  })
}

// Submit guess (admin only)
export async function submitGroupGuess(code, guess, currentImage, prevScore) {
  const dist = calcDistance(
    currentImage.lat, currentImage.lng,
    guess.lat, guess.lng
  )
  const score = calcScore(dist)

  await updateDoc(doc(db, 'rooms', code), {
    guess,
    gameState: 'result',
    lastDistance: parseFloat(dist.toFixed(1)),
    lastScore: score,
    totalScore: prevScore + score,
  })
}

// Next round (admin only)
export async function nextRound(code, currentRound) {
  const image = await getRandomMapillaryImage()
  await updateDoc(doc(db, 'rooms', code), {
    currentImage: image,
    gameState: 'playing',
    guess: null,
    round: currentRound + 1,
  })
}

// Listen to room changes in realtime
export function listenToRoom(code, callback) {
  return onSnapshot(doc(db, 'rooms', code), (snap) => {
    if (snap.exists()) callback(snap.data())
  })
}

// Inline helpers (avoids circular import)
function calcDistance(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function calcScore(distanceKm) {
  if (distanceKm <= 0.05) return 5000
  return Math.max(0, Math.round(5000 * Math.exp(-distanceKm / 2000)))
}
