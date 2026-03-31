import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/app/lib/supabase-server';
import { getAdminSupabase } from '@/app/lib/supabase-admin';

async function requireAdmin() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) return null;
  return user;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { email } = await request.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
  }

  const admin = getAdminSupabase();
  const normalizedEmail = email.trim().toLowerCase();

  // Ensure auth user exists so magic link works (signups may be disabled)
  const { data: existingUsers } = await admin.auth.admin.listUsers();
  const userExists = existingUsers?.users?.some(
    (u: { email?: string }) => u.email?.toLowerCase() === normalizedEmail
  );
  if (!userExists) {
    await admin.auth.admin.createUser({
      email: normalizedEmail,
      email_confirm: true,
    });
  }

  const { data, error } = await admin
    .from('secure_page_access')
    .insert({ page_id: id, email: normalizedEmail })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Email already has access' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
  }

  const { error } = await getAdminSupabase()
    .from('secure_page_access')
    .delete()
    .eq('page_id', id)
    .eq('email', email.trim().toLowerCase());

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
