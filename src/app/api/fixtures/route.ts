import { NextResponse } from 'next/server';
import { getAllFixtures, formatFixtureForUI } from '@/lib/fixtures';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const rawFixtures = await getAllFixtures();
    const formattedFixtures = rawFixtures.map(formatFixtureForUI);
    
    return NextResponse.json({
      fixtures: formattedFixtures.filter(f => f.status === 'upcoming'),
      results: formattedFixtures.filter(f => f.status === 'completed'),
    });
  } catch (error) {
    console.error('API Error fetching fixtures:', error);
    return NextResponse.json({ error: 'Failed to fetch fixtures' }, { status: 500 });
  }
}
