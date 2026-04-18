import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { sendEmail } from '../../lib/email';

export const prerender = false;

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const subject = String(form.get('subject') ?? '').trim();
  const message = String(form.get('message') ?? '').trim();
  const honeypot = String(form.get('website') ?? '').trim();

  if (honeypot) {
    return redirect('/contact?sent=1', 303);
  }

  if (!name || !email || !message) {
    return redirect('/contact?error=' + encodeURIComponent('Missing required fields'), 303);
  }

  // Store submission in Supabase (non-blocking failure tolerated)
  try {
    await supabase.from('contact_submissions').insert({
      name,
      email,
      subject: subject || null,
      message,
    });
  } catch (err) {
    console.error('[contact] insert failed', err);
  }

  const to = import.meta.env.CONTACT_TO_EMAIL || 'sarah@example.com';
  const subj = subject ? `New enquiry · ${subject}` : `New enquiry from ${name}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; color: #111;">
      <h2 style="font-weight: 400; letter-spacing: -0.01em;">New enquiry</h2>
      <p style="color: #6b6b66; font-size: 13px; text-transform: uppercase; letter-spacing: 0.18em; margin: 0 0 24px;">From the website</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
        <tr><td style="padding: 8px 0; color: #6b6b66; width: 110px;">Name</td><td style="padding: 8px 0;">${escape(name)}</td></tr>
        <tr><td style="padding: 8px 0; color: #6b6b66;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escape(email)}">${escape(email)}</a></td></tr>
        ${subject ? `<tr><td style="padding: 8px 0; color: #6b6b66;">Subject</td><td style="padding: 8px 0;">${escape(subject)}</td></tr>` : ''}
      </table>
      <hr style="border: 0; border-top: 1px solid #e5e5e0; margin: 24px 0;" />
      <div style="white-space: pre-wrap; font-size: 15px; line-height: 1.65;">${escape(message)}</div>
    </div>
  `;

  const result = await sendEmail({
    to,
    subject: subj,
    html,
    replyTo: email,
  });

  if (!result.ok) {
    console.error('[contact] email failed', result.error);
    return redirect('/contact?error=' + encodeURIComponent(result.error ?? 'Email failed'), 303);
  }

  return redirect('/contact?sent=1', 303);
};
