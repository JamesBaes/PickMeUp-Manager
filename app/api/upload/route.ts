import { createAdminClient, createClient } from '@/utils/server'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ROLES = ['admin', 'super_admin']

export async function POST(req: NextRequest) {
  const supabaseAuth = await createClient()
  const { data: { user } } = await supabaseAuth.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabaseAuth
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!ALLOWED_ROLES.includes(profile?.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File
  const path = formData.get('path') as string

  if (!file || !path) {
    return NextResponse.json({ error: 'Missing file or path' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { error } = await supabase.storage
    .from('menu-images')
    .upload(path, file, { upsert: true })

  if (error) {
    console.error('[API/upload] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const { data } = supabase.storage.from('menu-images').getPublicUrl(path)
  return NextResponse.json({ publicUrl: data.publicUrl })
}
