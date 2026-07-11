import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Simple in-memory rate limiting map: IP -> array of timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_COUNT = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional(),
  project: z.string().min(1),
  budget: z.string().min(1),
  timeline: z.string().min(1),
  message: z.string().min(10),
  honey: z.string().max(0).optional(), // Honeypot
});

export async function POST(req: Request) {
  try {
    // Basic Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    
    if (ip !== 'unknown') {
      const timestamps = rateLimitMap.get(ip) || [];
      const validTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
      
      if (validTimestamps.length >= RATE_LIMIT_COUNT) {
        return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
      }
      
      validTimestamps.push(now);
      rateLimitMap.set(ip, validTimestamps);
    }

    const body = await req.json();
    const parsedData = contactSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const data = parsedData.data;

    // Honeypot check
    if (data.honey) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, CONTACT_EMAIL } = process.env;

    // Skip sending email if SMTP is not configured (prevent crash in dev/build)
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_EMAIL) {
      console.warn("SMTP credentials not configured. Contact form submission received but email not sent.");
      return NextResponse.json({ success: true, warning: 'SMTP not configured' });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 465,
      secure: SMTP_SECURE === 'true',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    // 1. Email to Admin
    const adminMailOptions = {
      from: `"${data.name}" <${SMTP_USER}>`, // Send from SMTP user to avoid DMARC issues
      replyTo: data.email,
      to: CONTACT_EMAIL,
      subject: `New Project Inquiry from ${data.name} - ${data.project}`,
      html: `
        <h2>New Project Inquiry</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
        <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
        <p><strong>Project Type:</strong> ${data.project}</p>
        <p><strong>Budget:</strong> ${data.budget}</p>
        <p><strong>Timeline:</strong> ${data.timeline}</p>
        <h3>Message:</h3>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // 2. Auto-Reply to User
    const userMailOptions = {
      from: `"Muhammad Uzair" <${SMTP_USER}>`,
      to: data.email,
      subject: `Thanks for contacting Muhammad Uzair`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #06B6D4;">Hi ${data.name.split(' ')[0]},</h2>
          <p>Thanks for contacting me.</p>
          <p>I have received your inquiry regarding <strong>${data.project}</strong>.</p>
          <p>I will review your requirements carefully to ensure I can deliver the best results for your project.</p>
          <p><strong>Usually I respond within 2–6 hours during business days.</strong></p>
          <p>If you need urgent assistance, feel free to reply directly to this email or reach out on WhatsApp.</p>
          <br/>
          <p>Regards,</p>
          <p><strong>Muhammad Uzair</strong><br/>
          <span style="color: #666; font-size: 14px;">Full Stack Web Developer & DevOps Engineer</span></p>
        </div>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
