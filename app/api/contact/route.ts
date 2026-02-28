import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSupabase } from '@/app/lib/supabase';

const SUBJECTS = ['General Inquiry', 'Business Inquiry', 'Advisory', 'Speaking', 'Other'];

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, subject, message, honeypot } = body;

  if (honeypot) return NextResponse.json({ ok: true });

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  if (!SUBJECTS.includes(subject)) {
    return NextResponse.json({ error: 'Invalid subject' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  if (name.length > 100 || email.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: 'Input too long' }, { status: 400 });
  }

  const [dbResult, emailResult] = await Promise.allSettled([
    getSupabase()
      .from('contacts')
      .insert({ name, email, subject, message }),
    new Resend(process.env.RESEND_API_KEY).emails.send({
      from: 'contact@brettchereskin.com',
      to: process.env.CONTACT_EMAIL!,
      replyTo: email,
      subject: `[Contact] ${subject} — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#7d9a78;margin-bottom:4px;">New contact from ${name}</h2>
          <p style="color:#888;font-size:14px;margin-top:0;">${new Date().toLocaleString()}</p>
          <hr style="border:none;border-top:1px solid #333;margin:16px 0;" />
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="border:none;border-top:1px solid #333;margin:16px 0;" />
          <p style="white-space:pre-wrap;">${message}</p>
          <hr style="border:none;border-top:1px solid #333;margin:16px 0;" />
          <p style="font-size:12px;color:#888;">Sent via brettchereskin.com</p>
        </div>
      `,
    }),
  ]);

  if (dbResult.status === 'rejected') {
    console.error('Contact DB insert failed:', dbResult.reason);
  }
  if (emailResult.status === 'rejected') {
    console.error('Contact email failed:', emailResult.reason);
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
