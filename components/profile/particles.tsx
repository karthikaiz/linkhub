'use client'

import { useEffect, useState } from 'react'

type ParticleType = 'confetti' | 'stars' | 'bubbles' | 'snow' | 'hearts' | 'none'

interface ParticlesProps {
  type: ParticleType
  color?: string
  count?: number
}

const particleShapes: Record<ParticleType, string[]> = {
  confetti: ['■', '●', '▲', '★', '◆'],
  stars: ['✦', '✧', '★', '✶', '✷'],
  bubbles: ['●', '○', '◯'],
  snow: ['❄', '❅', '❆', '✻'],
  hearts: ['♥', '♡', '❤'],
  none: [],
}

const particleColors: Record<ParticleType, string[]> = {
  confetti: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'],
  stars: ['#FFD700', '#FFF8DC', '#FFFACD', '#F0E68C', '#FFE4B5'],
  bubbles: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.2)'],
  snow: ['#FFFFFF', '#F0F8FF', '#E8F4F8'],
  hearts: ['#FF6B6B', '#FF8E8E', '#FFB4B4', '#FF4757'],
  none: [],
}

export function Particles({ type, color, count = 30 }: ParticlesProps) {
  const [particles, setParticles] = useState<Array<{
    id: number
    shape: string
    color: string
    left: number
    delay: number
    duration: number
    size: number
  }>>([])

  useEffect(() => {
    if (type === 'none') {
      setParticles([])
      return
    }

    const shapes = particleShapes[type]
    const colors = color ? [color] : particleColors[type]

    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 12,
      size: type === 'bubbles' ? 10 + Math.random() * 30 : 12 + Math.random() * 16,
    }))

    setParticles(newParticles)
  }, [type, color, count])

  if (type === 'none' || particles.length === 0) return null

  const getAnimation = () => {
    switch (type) {
      case 'bubbles':
        return 'particleRise'
      case 'snow':
      case 'confetti':
        return 'particleFall'
      default:
        return 'particleFall'
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.left}%`,
            top: type === 'bubbles' ? '100%' : '-5%',
            fontSize: `${particle.size}px`,
            color: particle.color,
            animation: `${getAnimation()} ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
            opacity: type === 'bubbles' ? 0.6 : 0.8,
            textShadow: type === 'stars' ? `0 0 10px ${particle.color}` : 'none',
          }}
        >
          {particle.shape}
        </div>
      ))}
    </div>
  )
}
