import { useState } from 'react'

export function useTilt(maxRotate = 10, scale = 1.03) {
  const [tiltStyle, setTiltStyle] = useState({})

  const handleMouseMove = (e) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const xc = rect.width / 2
    const yc = rect.height / 2
    
    // Calculer l'angle de rotation (maxRotate degrés max)
    const rotateY = ((x - xc) / xc) * maxRotate
    const rotateX = ((yc - y) / yc) * maxRotate

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: 'transform 0.1s ease-out',
    })
  }

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out',
    })
  }

  return { tiltStyle, handleMouseMove, handleMouseLeave }
}
