import { createAdminClient, createClient } from "@/utils/server";
import { NextRequest, NextResponse } from "next/server";

const checkSuperAdmin = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized", status: 401 };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "super_admin") {
    return { error: "Forbidden", status: 403 };
  }

  return { error: null, status: 200 };
};

export async function POST(req: NextRequest) {
  const { error, status } = await checkSuperAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const supabaseAdmin = await createAdminClient();
  const { name, email, restaurant_id } = await req.json();

  if (!restaurant_id) {
    return NextResponse.json({ error: "restaurant_id is required" }, { status: 400 });
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

  if (authError) {
    console.error("Auth error:", authError);
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const { data, error: insertError } = await supabaseAdmin
    .from("profiles")
    .insert([{ id: authData.user.id, name, email, role: "admin", restaurant_id }])
    .select()
    .single();

  if (insertError) {
    console.error("Profile insert error:", insertError);
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const { error, status } = await checkSuperAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const supabaseAdmin = await createAdminClient();
  const { id } = await req.json();

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (deleteError) {
    console.error("Delete user error:", deleteError);
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}