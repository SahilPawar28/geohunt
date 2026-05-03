import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import './GuessMap.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function PinDropper({ onPin, disabled }) {
  useMapEvents({
    click(e) {
      if (!disabled) onPin({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

function GuessMap({ onSubmit, disabled = false }) {
  const [pin, setPin] = useState(null)
  const [expanded, setExpanded] = useState(false)

  function handleSubmit() {
    if (pin && !disabled) {
      onSubmit(pin)
      setPin(null)
      setExpanded(false)
    }
  }

  const statusText = disabled
    ? 'Observer Mode'
    : pin
      ? 'Pin placed — ready!'
      : 'Click map to place pin'

  return (
    <div className={`guess-overlay${expanded ? ' guess-overlay--expanded' : ''}`}>
      {/* Header */}
      <div className="guess-header">
        <div className="guess-status">
          <span className={`guess-dot${pin && !disabled ? ' guess-dot--active' : ''}`} />
          <span className="guess-status-text">{statusText}</span>
        </div>
        <button
          className="guess-toggle-btn"
          onClick={() => setExpanded(e => !e)}
          title={expanded ? 'Minimize' : 'Expand map'}
        >
          {expanded ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 14 10 14 10 20"></polyline>
              <polyline points="20 10 14 10 14 4"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
              <line x1="3" y1="21" x2="14" y2="10"></line>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Map */}
      <div className={`guess-map-area${disabled ? ' guess-map-area--disabled' : ''}`}>
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ width: '100%', height: '100%' }}
          worldCopyJump={false}
          zoomControl={expanded}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <PinDropper onPin={setPin} disabled={disabled} />
          {pin && <Marker position={[pin.lat, pin.lng]} />}
        </MapContainer>
        {disabled && (
          <div className="guess-disabled-overlay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>Watching…</span>
          </div>
        )}
      </div>

      {/* Footer */}
      {!disabled && (
        <div className="guess-footer">
          {pin && (
            <button className="guess-clear-btn" onClick={() => setPin(null)}>
              Clear
            </button>
          )}
          <button
            className="guess-submit-btn"
            disabled={!pin}
            onClick={handleSubmit}
          >
            {pin ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Submit Guess
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Place a Pin First
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default GuessMap
