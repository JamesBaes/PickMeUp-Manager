'use client'

import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const hasSupabaseClientConfig = Boolean(supabaseUrl && supabaseKey)

export const supabase = hasSupabaseClientConfig
	? createBrowserClient(supabaseUrl!, supabaseKey!)
	: null

export default supabase;
