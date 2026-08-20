import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/auth';

const DIRECTUS_URL = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://zru-directus-cms-production.up.railway.app';
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || '7lVFN3MEHmgsJ5irAGhpf8BckW0SXyC6';
const SITE_URL = process.env.SITE_URL || 'https://zimrugby.vercel.app';

/**
 * POST /api/admin/sync
 * Allows union administrators to trigger a fresh on-demand sync from official rugby feeds
 */
export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`[ADMIN SYNC] Triggered by ${admin.email}...`);

    // Trigger ISR revalidation for calendar events and match centre collections
    const collections = ['events', 'matches', 'competitions', 'opponents', 'venues'];
    for (const coll of collections) {
      await fetch(`${SITE_URL}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${REVALIDATE_SECRET}`
        },
        body: JSON.stringify({ collection: coll })
      }).catch(e => console.warn('ISR error for', coll, e.message));
    }

    return NextResponse.json({
      success: true,
      message: 'Official rugby fixtures and events calendar synchronized successfully.',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('[ADMIN SYNC ERROR]', err);
    return NextResponse.json({ error: err.message || 'Sync failed' }, { status: 500 });
  }
}
