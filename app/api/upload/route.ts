import { createClient } from '@/utils/server'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ROLES = ['admin', 'super_admin']

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const jwtPayload = JSON.parse(
    Buffer.from(session.access_token.split('.')[1], 'base64url').toString()
  )

  const appRole: string = jwtPayload?.app_metadata?.app_role ?? 'user'

  if (!ALLOWED_ROLES.includes(appRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File
  const path = formData.get('path') as string

  if (!file || !path) {
    return NextResponse.json({ error: 'Missing file or path' }, { status: 400 })
  }

  const { error } = await supabase.storage
    .from('menu-images')
    .upload(path, file, { upsert: true })

  if (error) {
    console.error('[API/upload] Storage error:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const { data } = supabase.storage.from('menu-images').getPublicUrl(path)
  return NextResponse.json({ publicUrl: data.publicUrl })
}
