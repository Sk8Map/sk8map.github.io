import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import spots from './spots.json'
import { MaptilerLayer, MapStyle } from '@maptiler/leaflet-maptilersdk'


function Map() {
  const minZoom = 3
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        minZoom,
        maxZoom: 18,
        maxBoundsViscosity: 1.0
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        noWrap: true,
        minZoom,
        maxZoom: 18
      }).addTo(mapInstanceRef.current)

      // Add markers from spots.json
      const markers = L.layerGroup().addTo(mapInstanceRef.current)
      if (Array.isArray(spots)) {
        spots.forEach((spot) => {
          if (Number.isFinite(spot.lat) && Number.isFinite(spot.lng)) {
            L.marker([spot.lat, spot.lng])
              .addTo(markers)
              .bindPopup(spot.name || 'Unnamed spot')
          }
        })
      }

      mapInstanceRef.current.locate({
        setView: true,
        maxZoom: 16,
        enableHighAccuracy: true
      })
    }
  }, [])

  return <div className="map-container" ref={mapRef} />
}

export default Map