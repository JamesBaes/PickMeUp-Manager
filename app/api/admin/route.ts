import { createAdminClient, createClient } from "@/utils/server";
import { NextRequest, NextResponse } from "next/server";

// API route for adding an admin
export async function POST(req: NextRequest) {

  // check the requester is a super admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'super_admin') {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // proceed with creating the admin
  const supabaseAdmin = await createAdminClient();
  const { name, email } = await req.json();

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
  });

  if (authError) {
    console.error('Auth error:', authError);
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .insert([{ id: authData.user.id, name, email, role: "admin" }])
    .select()
    .single();

  if (error) {
    console.error('Profile insert error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}



// API route for deleting an admin
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'super_admin') {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabaseAdmin = await createAdminClient();
  const { id } = await req.json();

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}