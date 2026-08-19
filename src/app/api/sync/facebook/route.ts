import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    deprecated: true,
    message: 'Facebook feed integration has been removed from public surfaces per stakeholder requirements.'
  });
}
