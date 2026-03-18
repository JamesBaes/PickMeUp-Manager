import { createAdminClient, createClient } from "@/utils/server";
import { NextRequest, NextResponse } from "next/server";

const checkAdmin = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized", status: 401, restaurantId: null }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, restaurant_id")
    .eq("id", user.id)
    .single();

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return { error: "Forbidden", status: 403, restaurantId: null }
  }

  return { error: null, status: 200, restaurantId: profile.restaurant_id }
}

export async function POST(req: NextRequest) {
  const { error, status, restaurantId } = await checkAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const supabaseAdmin = await createAdminClient()
  const { name, email, restaurant_id } = await req.json()

  const targetRestaurantId = restaurant_id ?? restaurantId

  if (!targetRestaurantId) {
    return NextResponse.json({ error: "restaurant_id is required" }, { status: 400 })
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email)

  if (authError) {
    console.error("Auth error:", authError)
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  const { data, error: insertError } = await supabaseAdmin
    .from("profiles")
    .insert([{ id: authData.user.id, name, email, role: "staff", restaurant_id: targetRestaurantId }])
    .select()
    .single()

  if (insertError) {
    console.error("Profile insert error:", insertError)
    return NextResponse.json({ error: insertError.message }, { status: 400 })
  }

  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const { error, status, restaurantId } = await checkAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const supabaseAdmin = await createAdminClient()
  const { id } = await req.json()

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("restaurant_id, role")
    .eq("id", id)
    .single()

  if (!profile) {
    return NextResponse.json({ error: "Staff member not found" }, { status: 404 })
  }

  if (profile.restaurant_id !== restaurantId) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: requester } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user?.id ?? '')
      .single()

    if (requester?.role !== 'super_admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(id)

  if (deleteError) {
    console.error("Delete user error:", deleteError)
    return NextResponse.json({ error: deleteError.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}