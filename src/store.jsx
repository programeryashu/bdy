import { useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from './lib/supabase'

import { DEFAULTS } from './constants'

function loadLocalState() {
  try {
    const s = localStorage.getItem('bd-config')
    if (s) return { ...DEFAULTS, ...JSON.parse(s) }
  } catch { /* ignore */ }
  return { ...DEFAULTS }
}

function saveLocalState(state) {
  try { localStorage.setItem('bd-config', JSON.stringify(state)) } catch { /* ignore */ }
}

import { StoreContext } from './context'

export function StoreProvider({ children }) {
  const [config, setConfig] = useState(loadLocalState)
  const [isLoading, setIsLoading] = useState(true)
  const isInitialized = useRef(false)

  // 1. Fetch from Supabase on mount
  useEffect(() => {
    async function fetchRemote() {
      try {
        const { data, error } = await supabase
          .from('birthday_config')
          .select('config')
          .eq('id', 'main')
          .single()

        if (data && data.config) {
          setConfig(prev => ({ ...DEFAULTS, ...prev, ...data.config }))
          saveLocalState(data.config)
        } else if (error && error.code !== 'PGRST116') {
          console.error('Supabase fetch error:', error)
        }
      } catch (err) {
        console.error('Failed to connect to Supabase:', err)
      } finally {
        setIsLoading(false)
        isInitialized.current = true
      }
    }

    fetchRemote()
  }, [])

  // 2. Save to Supabase and LocalStorage when config changes
  useEffect(() => {
    if (!isInitialized.current) return

    saveLocalState(config)

    const timer = setTimeout(async () => {
      try {
        await supabase
          .from('birthday_config')
          .upsert({ id: 'main', config: config, updated_at: new Date().toISOString() })
      } catch (err) {
        console.error('Failed to save to Supabase:', err)
      }
    }, 1000) // Debounce 1s

    return () => clearTimeout(timer)
  }, [config])

  const update = useCallback((partial) => {
    setConfig(prev => ({ ...prev, ...partial }))
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem('bd-config')
    setConfig({ ...DEFAULTS })
  }, [])

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'birthday-config.json'
    a.click()
  }, [config])

  const importJSON = useCallback(() => {
    const inp = document.createElement('input')
    inp.type = 'file'
    inp.accept = '.json'
    inp.onchange = (e) => {
      const f = e.target.files[0]
      if (!f) return
      const r = new FileReader()
      r.onload = (ev) => {
        try {
          const d = JSON.parse(ev.target.result)
          setConfig(prev => ({ ...prev, ...d }))
        } catch { alert('Invalid JSON file') }
      }
      r.readAsText(f)
    }
    inp.click()
  }, [])

  return (
    <StoreContext.Provider value={{ config, update, reset, exportJSON, importJSON, DEFAULTS, isLoading }}>
      {children}
    </StoreContext.Provider>
  )
}

