import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') || '/secure/login';
  const error = searchParams.get('error');
  const error_description = searchParams.get('error_description');

  // If Supabase returned an error, redirect to login
  if (error) {
    console.error('Auth callback error:', error, error_description);
    return NextResponse.redirect(new URL('/secure/login', request.url));
  }

  // No auth params at all — just redirect to the target
  if (!code && !token_hash) {
    return NextResponse.redirect(new URL(next, request.url));
  }

  const response = NextResponse.redirect(new URL(next, request.url));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  } else if (token_hash && type) {
    await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'magiclink' | 'email',
    });
  }

  return response;
}
