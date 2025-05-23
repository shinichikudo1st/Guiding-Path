import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { checks } = await request.json();

    if (!Array.isArray(checks)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    const uploadedIds = checks.map(check => String(check.check_id));

    const existingChecks = await prisma.check.findMany({
      where: {
        check_id: {
          in: uploadedIds
        }
      },
      select: {
        check_id: true
      }
    });

    const existingIds = new Set(existingChecks.map(check => check.check_id));

    const newChecks = checks.filter(check => !existingIds.has(String(check.check_id)));

    if (newChecks.length === 0) {
      return NextResponse.json({ 
        message: 'No new records to add', 
        added: 0,
        skipped: checks.length 
      });
    }
    
    const result = await prisma.$transaction(
      newChecks.map((check) => 
        prisma.check.create({
          data: {
            check_id: String(check.check_id),
            role: String(check.role),
          },
        })
      )
    );

    return NextResponse.json({ 
      message: 'Checks uploaded successfully', 
      added: result.length,
      skipped: checks.length - result.length
    });
  } catch (error) {
    console.error('Error uploading checks:', error);
    return NextResponse.json({ error: 'Failed to upload checks' }, { status: 500 });
  }
}
