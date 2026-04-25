import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useStore } from '../store'

const LINES = [
  "Thank you for opening this link...",
  "Your device is now under my control 😈",
  "Scanning gallery...",
  "Reading chats...",
  "Collecting embarrassing memories...",
  "System override complete..."
]

export default function PrankScreen({ onComplete }) {
  const { config } = useStore()
  const [lineIndex, setLineIndex] = useState(0)
  const [showJustKidding, setShowJustKidding] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    if (lineIndex < LINES.length) {
      const timer = setTimeout(() => {
        setLineIndex(prev => prev + 1)
      }, 800)
      return () => clearTimeout(timer)
    } else {
      // Start shaking and glitching
      startGlitch()
    }
  }, [lineIndex])

  const startGlitch = async () => {
    const intensity = config.prankIntensity === 'high' ? 10 : 4
    
    // Vibrate if supported
    if (window.navigator.vibrate) {
      window.navigator.vibrate([200, 100, 200, 100, 400])
    }

    await controls.start({
      x: [0, -intensity, intensity, -intensity, intensity, 0],
      y: [0, intensity, -intensity, intensity, -intensity, 0],
      transition: { duration: 0.1, repeat: 20 }
    })

    setShowJustKidding(true)
    
    setTimeout(() => {
      onComplete()
    }, 3000)
  }

  return (
    <motion.div 
      className="fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center font-mono p-6 overflow-hidden"
      animate={controls}
    >
      <div className="w-full max-w-lg">
        {LINES.slice(0, lineIndex).map((line, i) => (
          <motion.p 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-green-500 mb-2 text-sm sm:text-base"
          >
            <span className="text-green-800 mr-2">$</span>
            {line}
          </motion.p>
        ))}
        
        {lineIndex === LINES.length && !showJustKidding && (
          <motion.div 
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.1 }}
            className="w-full h-1 bg-red-600 mt-4 shadow-[0_0_15px_rgba(220,38,38,0.8)]"
          />
        )}
      </div>

      {showJustKidding && (
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-12 text-center"
        >
          <h2 className="text-white text-3xl sm:text-5xl font-bold mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
            Just kidding 😎
          </h2>
          <p className="text-rose-500 text-xl sm:text-2xl animate-bounce">
            Happy Birthday Legend!
          </p>
        </motion.div>
      )}

      {/* Matrix-like glitch overlay */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </motion.div>
  )
}
