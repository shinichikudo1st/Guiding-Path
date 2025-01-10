import { NextResponse } from 'next/server';
import prisma from '@/app/utils/prisma';
import { generateVerificationToken, sendVerificationEmail } from '@/app/utils/emailVerification';
import moment from 'moment-timezone';

export async function POST(request) {
  try {
    const { email } = await request.json();

    const user = await prisma.users.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Check if there's a valid token that was recently sent (within last 5 minutes)
    if (
      user.verificationToken &&
      user.verificationExpiry &&
      moment(user.verificationExpiry)
        .subtract(23, 'hours')
        .subtract(55, 'minutes')
        .isAfter(moment().tz('Asia/Manila'))
    ) {
      return NextResponse.json(
        { message: 'Please wait 5 minutes before requesting another verification email' },
        { status: 429 }
      );
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationExpiry = moment().tz('Asia/Manila').add(24, 'hours').toDate();

    await prisma.users.update({
      where: { user_id: user.user_id },
      data: {
        verificationToken,
        verificationExpiry,
      },
    });

    // Send new verification email
    await sendVerificationEmail(user.email, verificationToken, user.name);

    return NextResponse.json({ 
      message: 'Verification email sent successfully' 
    });
  } catch (error) {
    console.error('Error resending verification:', error);
    return NextResponse.json(
      { message: 'Failed to resend verification email' },
      { status: 500 }
    );
  }
}
