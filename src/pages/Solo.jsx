import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StreetView from '../components/StreetView'
import GuessMap from '../components/GuessMap'
import ResultMap from '../components/ResultMap'
import { getRandomMapillaryImage } from '../utils/mapillary'
import { calculateDistance, calculateScore, getScoreLabel } from '../utils/score'
import './Solo.css'

const TOTAL_ROUNDS = 5

function Solo() {
  const navigate = useNavigate()
  const [gameState, setGameState] = useState('playing') // playing | result | gameover
  const [currentImage, setCurrentImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [guess, setGuess] = useState(null)
  const [totalScore, setTotalScore] = useState(0)
  const [round, setRound] = useState(1)
  const [roundScores, setRoundScores] = useState([]) // [{score, distance, label, location}]

  async function loadNewLocation() {
    setLoading(true)
    setError(null)
    setGuess(null)
    try {
      const image = await getRandomMapillaryImage()
      setCurrentImage(image)
    } catch {
      setError('Failed to load location. Retrying...')
      try {
        const image = await getRandomMapillaryImage()
        setCurrentImage(image)
        setError(null)
      } catch {
        setError('Could not load location. Check your token.')
      }
    }
    setLoading(false)
  }

  useEffect(() => { loadNewLocation() }, [])

  function handleGuessSubmit(pin) {
    const dist = calculateDistance(
      currentImage.lat, currentImage.lng,
      pin.lat, pin.lng
    )
    const score = calculateScore(dist)
    const info = getScoreLabel(score)
    setGuess(pin)
    setTotalScore(prev => prev + score)
    setRoundScores(prev => [...prev, {
      score,
      distance: dist.toFixed(1),
      label: info.label,
      color: info.color,
      location: currentImage.label,
    }])
    setGameState('result')
  }

  function handleNextRound() {
    if (round >= TOTAL_ROUNDS) {
      setGameState('gameover')
    } else {
      setRound(r => r + 1)
      setGameState('playing')
      loadNewLocation()
    }
  }

  function handlePlayAgain() {
    setRound(1)
    setTotalScore(0)
    setRoundScores([])
    setGuess(null)
    setGameState('playing')
    loadNewLocation()
  }

  const currentRoundScore = guess && currentImage
    ? calculateScore(calculateDistance(
        currentImage.lat, currentImage.lng,
        guess.lat, guess.lng
      ))
    : 0
  const currentDist = guess && currentImage
    ? calculateDistance(
        currentImage.lat, currentImage.lng,
        guess.lat, guess.lng
      ).toFixed(1)
    : 0
  const scoreInfo = getScoreLabel(currentRoundScore)
  const maxScore = TOTAL_ROUNDS * 5000
  const percentage = Math.round((totalScore / maxScore) * 100)

  // ── GAME OVER ──
  if (gameState === 'gameover') {
    return (
      <div className="gameover-screen">
        <div className="gameover-bg" />
        <div className="gameover-card">
          <div className="gameover-trophy">🏆</div>
          <h1 className="gameover-title">Game Over!</h1>
          <div className="gameover-score-wrap">
            <span className="gameover-score">{totalScore.toLocaleString()}</span>
            <span className="gameover-max">/ {maxScore.toLocaleString()} pts</span>
          </div>
          <div className="gameover-bar-wrap">
            <div className="gameover-bar">
              <div className="gameover-bar-fill" style={{ width: `${percentage}%` }} />
            </div>
            <span className="gameover-pct">{percentage}%</span>
          </div>

          <div className="gameover-rounds">
            {roundScores.map((r, i) => (
              <div key={i} className="gameover-round-row">
                <span className="gameover-round-num">R{i + 1}</span>
                <span className="gameover-round-loc" title={r.location}>{r.location}</span>
                <span className="gameover-round-dist">{r.distance} km</span>
                <span className="gameover-round-score" style={{ color: r.color }}>
                  {r.score.toLocaleString()} pts
                </span>
              </div>
            ))}
          </div>

          <div className="gameover-actions">
            <button className="btn-play-again" onClick={handlePlayAgain}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <polyline points="1 4 1 10 7 10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 .49-3.51"></path>
              </svg>
              Play Again
            </button>
            <button className="btn-home-go" onClick={() => navigate('/')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── RESULT ──
  if (gameState === 'result') {
    return (
      <div className="solo-container">
        <div className="result-screen">
          {guess && currentImage && (
            <ResultMap actual={currentImage} guess={guess} />
          )}
          <div className="result-info">
            <p className="result-label" style={{ color: scoreInfo.color }}>
              {scoreInfo.label}
            </p>
            <p className="result-distance">{currentDist} km away</p>
            <p className="result-score">+{currentRoundScore.toLocaleString()} pts</p>
            <p className="result-total">Total: {totalScore.toLocaleString()} pts</p>
            <p className="result-actual">📍 {currentImage?.label}</p>

            {/* Round progress dots */}
            <div className="round-dots">
              {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
                <span
                  key={i}
                  className={`round-dot ${i < round ? 'round-dot--done' : ''} ${i === round - 1 ? 'round-dot--current' : ''}`}
                />
              ))}
            </div>
            <p className="result-round-label">Round {round} of {TOTAL_ROUNDS}</p>

            <div className="result-actions">
              <button className="btn-next" onClick={handleNextRound}>
                {round >= TOTAL_ROUNDS ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                      <polyline points="22 17 13 17 13 21"></polyline>
                      <path d="M2 3l20 18"></path>
                    </svg>
                    See Results
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Next Round
                  </>
                )}
              </button>
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

  // ── PLAYING ──
  return (
    <div className="solo-container">
      {/* HUD */}
      <div className="hud">
        <div className="hud-left">
          <span className="hud-round">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hud-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            Round {round}/{TOTAL_ROUNDS}
          </span>
          {/* Round progress dots */}
          <div className="hud-dots">
            {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
              <span key={i} className={`hud-dot ${i < round - 1 ? 'hud-dot--done' : ''} ${i === round - 1 ? 'hud-dot--active' : ''}`} />
            ))}
          </div>
        </div>

        <span className="hud-title">GeoHunt</span>

        <div className="hud-right">
          <span className="hud-score">
            <svg viewBox="0 0 24 24" fill="currentColor" className="hud-icon score-star">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            {totalScore.toLocaleString()}
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

      {/* Street View panel */}
      <div className="street-view-panel">
        {loading && (
          <div className="street-view-placeholder">
            <div className="loader-ring" />
            <p>Loading location…</p>
          </div>
        )}
        {error && (
          <div className="street-view-placeholder error-placeholder">
            <p>{error}</p>
            <button className="btn-retry" onClick={loadNewLocation}>Retry</button>
          </div>
        )}
        {!loading && !error && currentImage && (
          <StreetView imageId={currentImage.imageId} />
        )}
      </div>

      {/* Floating guess map */}
      {!loading && !error && <GuessMap onSubmit={handleGuessSubmit} />}
    </div>
  )
}

export default Solo
