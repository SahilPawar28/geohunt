import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { listenToRoom, startGame, submitGroupGuess, nextRound } from '../firebase/rooms'
import StreetView from '../components/StreetView'
import GuessMap from '../components/GuessMap'
import ResultMap from '../components/ResultMap'
import { getScoreLabel } from '../utils/score'
import './Room.css'
import './Solo.css'

function Room() {
  const { code } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const playerName = location.state?.playerName
  const isAdmin = location.state?.isAdmin

  const [room, setRoom] = useState(null)

  useEffect(() => {
    if (!playerName) navigate('/group')
  }, [])

  useEffect(() => {
    if (!code) return
    const unsub = listenToRoom(code, (data) => setRoom(data))
    return () => unsub()
  }, [code])

  if (!room) {
    return (
      <div className="room-loading">
        <div className="room-loading-icon">🌍</div>
        Connecting to room…
      </div>
    )
  }

  const scoreInfo = getScoreLabel(room.lastScore || 0)

  // ── WAITING ──
  if (room.gameState === 'waiting') {
    return (
      <div className="room-waiting">
        <div className="wave-layer wave-layer-1" />
        <div className="wave-layer wave-layer-2" />

        <div className="room-card">
          <div className="room-logo-row">
            <img src="/geohunt-logo.png" alt="GeoHunt" className="room-logo" />
          </div>

          <p className="room-code-label">Room Code</p>
          <div className="room-code">{code}</div>
          <p className="room-share">Share this code with friends!</p>

          <div className="players-list">
            <p className="players-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hud-icon">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Players ({room.players.length})
            </p>
            {room.players.map((p, i) => (
              <div key={i} className="player-item">
                {p === room.admin ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="player-icon admin-tag">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="player-icon">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                )}
                <span className={p === room.admin ? 'player-name player-name--admin' : 'player-name'}>
                  {p}
                </span>
                {p === room.admin && <span className="admin-badge">Admin</span>}
                {p === playerName && <span className="you-badge">You</span>}
              </div>
            ))}
          </div>

          {isAdmin ? (
            <button className="btn-start" onClick={() => startGame(code)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Start Game
            </button>
          ) : (
            <div className="waiting-msg-wrap">
              <div className="waiting-spinner" />
              <p className="waiting-msg">Waiting for admin to start…</p>
            </div>
          )}

          <button className="btn-quit-room" onClick={() => navigate('/group')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icon-sm">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Leave Room
          </button>
        </div>
      </div>
    )
  }

  // ── PLAYING ──
  if (room.gameState === 'playing') {
    return (
      <div className="solo-container">
        <div className="hud">
          <div className="hud-left">
            <span className="hud-round">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hud-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              Round {room.round}
            </span>
            <span className="hud-room-code">#{code}</span>
          </div>

          <span className="hud-title">GeoHunt</span>

          <div className="hud-right">
            <span className="hud-score">
              <svg viewBox="0 0 24 24" fill="currentColor" className="hud-icon score-star">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              {room.totalScore?.toLocaleString()}
            </span>
            <button className="btn-quit-hud" onClick={() => navigate('/')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icon-sm">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span className="quit-label">Quit</span>
            </button>
          </div>
        </div>

        <div className="street-view-panel">
          {room.currentImage && <StreetView imageId={room.currentImage.imageId} />}
        </div>

        <GuessMap
          onSubmit={(pin) => submitGroupGuess(code, pin, room.currentImage, room.totalScore)}
          disabled={!isAdmin}
        />
      </div>
    )
  }

  // ── RESULT ──
  if (room.gameState === 'result') {
    return (
      <div className="solo-container">
        <div className="result-screen">
          {room.currentImage && room.guess && (
            <ResultMap actual={room.currentImage} guess={room.guess} />
          )}
          <div className="result-info">
            <p className="result-label" style={{ color: scoreInfo.color }}>
              {scoreInfo.label}
            </p>
            <p className="result-distance">{room.lastDistance} km away</p>
            <p className="result-score">+{room.lastScore?.toLocaleString()} pts</p>
            <p className="result-total">Total: {room.totalScore?.toLocaleString()} pts | Round {room.round}</p>
            <p className="result-actual">📍 {room.currentImage?.label}</p>

            {/* Players row */}
            <div className="players-result">
              <p className="players-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14}}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Players
              </p>
              {room.players.map((p, i) => (
                <div key={i} className="player-item player-item--compact">
                  <span className="player-name">{p}</span>
                  {p === room.admin && <span className="admin-badge">Admin</span>}
                  {p === playerName && <span className="you-badge">You</span>}
                </div>
              ))}
            </div>

            <div className="result-actions">
              {isAdmin ? (
                <button className="btn-next" onClick={() => nextRound(code, room.round)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  Next Round
                </button>
              ) : (
                <div className="waiting-msg-wrap">
                  <div className="waiting-spinner" />
                  <p className="waiting-msg">Waiting for admin…</p>
                </div>
              )}
              <button className="btn-quit-result" onClick={() => navigate('/')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Quit
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Room
