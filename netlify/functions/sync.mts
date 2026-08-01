/*
 * sync.mts — shared-state backend for the app's cross-device sync.
 *
 * Single JSON blob, single fixed key: this app is used by two people (a
 * couple) tracking one baby's progress together, so there is deliberately no
 * per-user partitioning — both devices read and write the same record. The
 * client (js/storage.js) resolves which copy wins by comparing `updatedISO`.
 */
import type { Config, Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const KEY = 'state';

function store() {
  // Strong consistency: with only two writers and infrequent writes,
  // correctness (never reading a stale copy right after a save) matters more
  // than the read latency it costs.
  return getStore({ name: 'baby-word-of-the-day', consistency: 'strong' });
}

export default async (req: Request, _context: Context) => {
  if (req.method === 'GET') {
    const data = await store().get(KEY, { type: 'json' });
    return Response.json(data ?? null);
  }

  if (req.method === 'POST') {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return new Response('Invalid body', { status: 400 });
    }
    await store().setJSON(KEY, body);
    return new Response(null, { status: 204 });
  }

  return new Response('Method Not Allowed', { status: 405 });
};

export const config: Config = {
  path: '/api/sync',
  method: ['GET', 'POST'],
};
