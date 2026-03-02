import { useState, useEffect, useCallback, useRef } from 'react'

const BG_W = 1280
const BG_H = 720

// Right-facing cars only
const CAR_TYPES = [
  { src: '/sprites/Car_2_complete_32x32_7-export_Right.png', frameW: 192, frameH: 96, frames: 6 },
  { src: '/sprites/Car_3_32x32_4-export_Right.png', frameW: 192, frameH: 96, frames: 6 },
  { src: '/sprites/Car_5_32x32_1-export_Right.png', frameW: 160, frameH: 96, frames: 6 },
  { src: '/sprites/Car_5_32x32_4-export_Right.png', frameW: 160, frameH: 96, frames: 6 },
  { src: '/sprites/Car_classic_red_complete_32x32-export_Right.png', frameW: 160, frameH: 96, frames: 6 },
]

// Sprites exported at 1920x1080, background is 1280x720
const SCALE = 1280 / 1920
const toPctW = (px) => (px * SCALE / BG_W) * 100

// Lane Y position
const LANE_TOP = 86

// Static props — left/top are 1920x1080 coords converted to %
const PROPS = [
  {
    id: 'ambulance',
    src: '/sprites/Ambulance.png',
    frameW: 96, frameH: 224, frames: 14,
    left: (1280 / 1920) * 100, top: (560 / 1080) * 100, duration: 1.4,
    anim: 'sprite-14-pause 9.4s step-end infinite',
  },
  {
    id: 'stretcher',
    src: '/sprites/Hospital_Stretcher_Character_5_front_32x32.png',
    frameW: 64, frameH: 96, frames: 6,
    left: (1310 / 1920) * 100, top: (680 / 1080) * 120, duration: 0.8,
  },
  {
    id: 'dumpster',
    src: '/sprites/Dumpster_full_smeared_32x32.png',
    frameW: 64, frameH: 96, frames: 12,
    left: (736 / 1920) * 100, top: (110 / 1080) * 110, duration: 2.4,
    anim: 'sprite-12-pause 11.2s step-end infinite',
  },
]

// Sprite using background-image — no overflow clipping needed
const Sprite = ({ src, frameW, frameH, frames, duration = 0.6, anim, style = {} }) => (
  <div
    style={{
      width: '100%',
      aspectRatio: `${frameW} / ${frameH}`,
      backgroundImage: `url(${src})`,
      backgroundSize: `${frames * 100}% 100%`,
      backgroundPosition: '0% 0%',
      backgroundRepeat: 'no-repeat',
      imageRendering: 'pixelated',
      animation: anim || `sprite-${frames} ${duration}s steps(${frames}) infinite`,
      ...style,
    }}
  />
)

let nextId = 0

const AnimatedHero = () => {
  const [cars, setCars] = useState([])
  const timerRef = useRef(null)

  const spawnCar = useCallback(() => {
    const type = CAR_TYPES[Math.floor(Math.random() * CAR_TYPES.length)]
    const speed = 10 + Math.random() * 5
    setCars(prev => [...prev, { id: ++nextId, type, speed }])
  }, [])

  const removeCar = useCallback((id) => {
    setCars(prev => prev.filter(c => c.id !== id))
  }, [])

  useEffect(() => {
    const scheduleNext = (delay) => {
      timerRef.current = setTimeout(() => {
        spawnCar()
        scheduleNext(7000 + Math.random() * 6000)
      }, delay)
    }
    scheduleNext(1000)
    return () => clearTimeout(timerRef.current)
  }, [spawnCar])

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div
        className="relative w-full"
        style={{ aspectRatio: `${BG_W} / ${BG_H}`, maxHeight: '100vh' }}
      >
        {/* Background */}
        <img
          src="/screenshots/hero.jpg"
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Cars */}
        {cars.map(({ id, type, speed }) => (
          <div
            key={id}
            className="absolute"
            style={{
              top: `${LANE_TOP}%`,
              width: `${toPctW(type.frameW)}%`,
              animation: `drive-right ${speed}s linear forwards`,
            }}
            onAnimationEnd={() => removeCar(id)}
          >
            <Sprite
              src={type.src}
              frameW={type.frameW}
              frameH={type.frameH}
              frames={type.frames}
              duration={type.frames * 0.1}
            />
          </div>
        ))}

        {/* Static props */}
        {PROPS.map(p => (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${toPctW(p.frameW)}%`,
            }}
          >
            <Sprite
              src={p.src}
              frameW={p.frameW}
              frameH={p.frameH}
              frames={p.frames}
              duration={p.duration}
              anim={p.anim}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default AnimatedHero
