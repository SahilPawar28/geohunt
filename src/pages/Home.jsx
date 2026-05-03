import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      {/* Animated wave background */}
      <div className="wave-layer wave-layer-1" />
      <div className="wave-layer wave-layer-2" />

      {/* Floating bubbles */}
      <div className="bubble bubble-1" />
      <div className="bubble bubble-2" />
      <div className="bubble bubble-3" />
      <div className="bubble bubble-4" />

      <div className="home-inner">
        {/* Main card */}
        <div className="home-card">
          <div className="logo-wrapper">
            <img src="/geohunt-logo.png" alt="GeoHunt logo" className="home-logo" />
          </div>

          <p className="home-subtitle">Explore the World, One Guess at a Time</p>

          <div className="home-buttons">
            <button className="btn-solo" onClick={() => navigate('/solo')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
              Solo Play
            </button>
            <button className="btn-group" onClick={() => navigate('/group')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Play Together
            </button>
          </div>

          <div className="home-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            200+ locations · 5 rounds · Free to play
          </div>
        </div>

        {/* How to Play */}
        <div className="how-to-play">
          <p className="how-title">How to Play</p>
          <div className="how-steps">
            <div className="how-step">
              <div className="how-step-num">1</div>
              <div className="how-step-text">
                <strong>Look around</strong>
                <span>Explore the street view scene for clues</span>
              </div>
            </div>
            <div className="how-step">
              <div className="how-step-num">2</div>
              <div className="how-step-text">
                <strong>Place your pin</strong>
                <span>Click on the mini map to mark where you think it is</span>
              </div>
            </div>
            <div className="how-step">
              <div className="how-step-num">3</div>
              <div className="how-step-text">
                <strong>Score points</strong>
                <span>The closer your guess, the more points you earn (max 5,000)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
