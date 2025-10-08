import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, getDocs } from "firebase/firestore";


function Map({ onSpotClick }) {
  const firebaseConfig = {
  apiKey: "AIzaSyBamIDOQ_lP--zglGi2p5p1gQyjwi6dMHw",
  authDomain: "sk8map-48fb2.firebaseapp.com",
  projectId: "sk8map-48fb2",
  storageBucket: "sk8map-48fb2.firebasestorage.app",
  messagingSenderId: "548205139679",
  appId: "1:548205139679:web:a9edef9b9f6b830328bb6a",
  measurementId: "G-XRMTKZDRRW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



  const minZoom = 3
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef(null)

  useEffect(() => {
    console.log('Map useEffect starting')
    let unsubscribe = null
    if (mapRef.current && !mapInstanceRef.current) {
      console.log('Map ref exists, initializing Leaflet map')
      mapInstanceRef.current = L.map(mapRef.current, {
        minZoom,
        maxZoom: 18,
        maxBoundsViscosity: 1.0
      })
      // Set a sensible default view so the map is not blank
      mapInstanceRef.current.setView([20, 0], 3)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        noWrap: true,
        minZoom,
        maxZoom: 18
      }).addTo(mapInstanceRef.current)
      // Ensure Leaflet recalculates size after mount
      setTimeout(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize()
      }, 0)

      // Subscribe to Firestore spots collection and render markers
      markersRef.current = L.layerGroup().addTo(mapInstanceRef.current)
      // One-time read to verify Firestore access
      getDocs(collection(db, 'Spots'))
        .then((snap) => {
          console.log('Initial getDocs Spots count:', snap.size)
          const bounds = []
          snap.forEach((doc) => {
            const data = doc.data()
            const lat = typeof data.lat === 'number' ? data.lat : parseFloat(data.lat)
            const lng = typeof data.lng === 'number' ? data.lng : parseFloat(data.lng)
            if (Number.isFinite(lat) && Number.isFinite(lng)) {
              const isSkatepark = !!data.skatepark
              const icon = L.icon({
                iconUrl: isSkatepark ? '/skateparkMark.svg' : '/spotMark.svg',
                iconSize: [56, 56],
                iconAnchor: [28, 56],
                className: isSkatepark ? 'icon-skatepark' : 'icon-spot'
              })
              const marker = L.marker([lat, lng], { icon, title: data.name || '' }).addTo(markersRef.current)
              marker.on('click', () => {
                if (typeof onSpotClick === 'function') {
                  onSpotClick({
                    name: data.name || 'Unnamed spot',
                    modules: Array.isArray(data.modules) ? data.modules : [],
                    skatepark: !!data.skatepark,
                    userSubmited: typeof data.userSubmited === 'string' ? data.userSubmited : '',
                    mapsUrl: typeof data.mapsUrl === 'string' ? data.mapsUrl : '',
                    lat,
                    lng
                  })
                }
              })
              bounds.push([lat, lng])
            }
          })
          if (bounds.length > 0 && mapInstanceRef.current) {
            mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 })
          }
        })
        .catch((err) => console.error('getDocs error:', err))
      
        
      

      mapInstanceRef.current.locate({
        setView: false,
        maxZoom: 16,
        enableHighAccuracy: true
      })
    }
    return () => {
      // Cleanup Firestore listener on unmount
      if (unsubscribe) unsubscribe()
      if (markersRef.current) {
        markersRef.current.clearLayers()
      }
    }
  }, [])

  return <div className="map-container" ref={mapRef} />
}

export default Map