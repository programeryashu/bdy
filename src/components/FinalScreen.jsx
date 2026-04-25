import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import confetti from 'canvas-confetti'
import { useStore } from '../store'
import CatchGame from './CatchGame'

export default function FinalScreen({ onRestart }) {
  const { config } = useStore()
  const [showGallery, setShowGallery] = useState(false)
  const [showReveal, setShowReveal] = useState(false)

  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-center justify-center px-4"
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="glass rounded-[28px] p-8 text-center max-w-[500px] w-full shadow-2xl relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-[family-name:var(--font-display)] text-[var(--color-gold)] text-2xl sm:text-3xl mb-4">
          🌟 One Last Thing...
        </h2>
        
        <p className="font-[family-name:var(--font-script)] text-white/90 text-xl sm:text-2xl leading-relaxed mb-6">
          {config.finalMsg}
        </p>

        {/* Mini Game Section */}
        <section className="space-y-4 mb-8">
          <h3 className="text-[var(--color-rose)] font-medium text-center">🎁 Mini-Game: Catch 20 Gifts!</h3>
          <CatchGame onUnlock={() => confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })} />
        </section>

        {/* Photo Gallery Button */}
        {config.photos && config.photos.length > 0 && (
          <button 
            className="w-full bg-white/10 border border-white/20 py-3 rounded-2xl hover:bg-white/20 transition-colors mb-4"
            onClick={() => setShowGallery(true)}
          >
            📸 View Photo Gallery
          </button>
        )}

        {/* Final Surprise Button */}
        <div className="pt-6 border-t border-white/10 text-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-rose-500 to-amber-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-rose-500/20"
            onClick={() => setShowReveal(true)}
          >
            One More Surprise ✨
          </motion.button>
          
          <AnimatePresence>
            {showReveal && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10 text-[var(--color-blush)]"
              >
                <p className="text-xl font-medium animate-pulse">
                  Check WhatsApp / Look behind you 😎
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          className="w-full text-white/40 text-sm hover:text-white/60 transition-colors"
          onClick={onRestart}
        >
          ↺ Start Over
        </button>
      </motion.div>
    </motion.div>
  )
}
