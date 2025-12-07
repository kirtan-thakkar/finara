import { EmailTemplate } from '@/components/email-template';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
const resend = new Resend(process.env.RESEND_API_KEY);
export async function GET(){
    return NextResponse.json({
        message : "The get request is working"
    })
}
export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'KIRTAN<onboarding@resend.dev>',
      to: ['kirtanthakkar30@gmail.com'],
      subject: 'Hello world',
      react: EmailTemplate({ firstName: 'Kirtan' }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
