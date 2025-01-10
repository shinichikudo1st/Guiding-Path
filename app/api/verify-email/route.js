import { NextResponse } from 'next/server';
import prisma from '@/app/utils/prisma';
import moment from 'moment-timezone';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ message: 'Verification token is required' }, { status: 400 });
    }

    const user = await prisma.users.findFirst({
      where: {
        verificationToken: token,
        verificationExpiry: {
          gt: moment().tz('Asia/Manila').toDate(),
        },
      },
    });

    if (!user) {
      return NextResponse.json({ 
        message: 'Invalid or expired verification token' 
      }, { status: 400 });
    }

    await prisma.users.update({
      where: { user_id: user.user_id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpiry: null,
      },
    });

    return NextResponse.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
