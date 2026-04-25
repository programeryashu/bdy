
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const env = fs.readFileSync('.env', 'utf8')
const lines = env.split('\n')
const config = {}
lines.forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) config[key.trim()] = value.trim()
})

const supabaseUrl = config.VITE_SUPABASE_URL
const supabaseAnonKey = config.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupBucket() {
  const { data, error } = await supabase.storage.createBucket('memories', {
    public: true,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
    fileSizeLimit: 5242880 // 5MB
  })
  if (error) {
    console.error('Error creating bucket:', error)
  } else {
    console.log('Bucket created:', data)
  }
}

setupBucket()
