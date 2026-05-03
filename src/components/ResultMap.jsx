import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Green marker for actual location
const actualIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

// Red marker for guess
const guessIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

function FitBounds({ actual, guess }) {
  const map = useMap()
  useEffect(() => {
    const bounds = L.latLngBounds(
      [actual.lat, actual.lng],
      [guess.lat, guess.lng]
    )
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [actual, guess])
  return null
}

function ResultMap({ actual, guess }) {
  return (
    <MapContainer
      center={[actual.lat, actual.lng]}
      zoom={4}
      style={{ width: '100%', height: '220px', borderRadius: '12px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <FitBounds actual={actual} guess={guess} />
      <Marker position={[actual.lat, actual.lng]} icon={actualIcon} />
      <Marker position={[guess.lat, guess.lng]} icon={guessIcon} />
      <Polyline
        positions={[[actual.lat, actual.lng], [guess.lat, guess.lng]]}
        color="#ffd200"
        dashArray="6"
        weight={2}
      />
    </MapContainer>
  )
}

export default ResultMap
