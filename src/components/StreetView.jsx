import { useEffect, useRef } from 'react'
import { Viewer } from 'mapillary-js'
import 'mapillary-js/dist/mapillary.css'

function StreetView({ imageId }) {
  const containerRef = useRef(null)
  const viewerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || !imageId) return

    // Destroy previous viewer if exists
    if (viewerRef.current) {
      viewerRef.current.remove()
      viewerRef.current = null
    }

    viewerRef.current = new Viewer({
      accessToken: import.meta.env.VITE_MAPILLARY_TOKEN,
      container: containerRef.current,
      imageId: imageId,
      component: {
        cover: false,
        sequence: true,
        zoom: true,
      },
    })

    return () => {
      if (viewerRef.current) {
        viewerRef.current.remove()
        viewerRef.current = null
      }
    }
  }, [imageId])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
    />
  )
}

export default StreetView
