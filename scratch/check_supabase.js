
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

async function checkBuckets() {
  const { data, error } = await supabase.storage.listBuckets()
  if (error) {
    console.error('Error listing buckets:', error)
  } else {
    console.log('Buckets:', data)
  }
}

checkBuckets()
