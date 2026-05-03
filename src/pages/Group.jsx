import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRoom, joinRoom } from '../firebase/rooms'
import './Group.css'

function Group() {
  const navigate = useNavigate()
  const [mode, setMode] = useState(null) // 'create' | 'join'
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate() {
    if (!name.trim()) return setError('Enter your name!')
    setLoading(true)
    setError('')
    try {
      const roomCode = await createRoom(name.trim())
      navigate(`/room/${roomCode}`, {
        state: { playerName: name.trim(), isAdmin: true }
      })
    } catch (e) {
      setError('Failed to create room. Try again.')
    }
    setLoading(false)
  }

  async function handleJoin() {
    if (!name.trim()) return setError('Enter your name!')
    if (!code.trim()) return setError('Enter room code!')
    setLoading(true)
    setError('')
    try {
      await joinRoom(code.trim(), name.trim())
      navigate(`/room/${code.toUpperCase()}`, {
        state: { playerName: name.trim(), isAdmin: false }
      })
    } catch (e) {
      setError(e.message || 'Failed to join room.')
    }
    setLoading(false)
  }

  return (
    <div className="group-container">
      {/* Wave layers */}
      <div className="wave-layer wave-layer-1" />
      <div className="wave-layer wave-layer-2" />

      <div className="group-card">
        <div className="group-logo-row">
          <img src="/geohunt-logo.png" alt="GeoHunt" className="group-logo" />
        </div>
        <h1 className="group-title">Play Together</h1>

        {!mode && (
          <div className="group-buttons">
            <button className="btn-create" onClick={() => setMode('create')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Create Room
            </button>
            <button className="btn-join" onClick={() => setMode('join')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              Join Room
            </button>
            <button className="btn-back" onClick={() => navigate('/')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="btn-icon-sm">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Home
            </button>
          </div>
        )}

        {mode && (
          <div className="group-form">
            <input
              className="group-input"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            {mode === 'join' && (
              <input
                className="group-input"
                placeholder="Room code (e.g. AB12CD)"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
            )}

            {error && <p className="group-error">{error}</p>}

            <button
              className="btn-go"
              onClick={mode === 'create' ? handleCreate : handleJoin}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
              {loading ? 'Please wait...' : mode === 'create' ? 'Create & Enter' : 'Join Room'}
            </button>

            <button className="btn-back" onClick={() => { setMode(null); setError('') }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="btn-icon-sm">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Group
