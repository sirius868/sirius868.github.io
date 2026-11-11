import { locationInChinese } from './location.js';
import { connectionIp } from './ip.js';
import { beijingTime } from './time.js';

const allowedOrigin = 'https://sirius868.github.io';
const pathPattern = /^\/[a-z0-9\-_%./]*$/i;
const hex = (buffer) => [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');

export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin');
    if (origin !== allowedOrigin) return new Response(null, { status: 403 });
    const headers = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
      'Cache-Control': 'no-store'
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return new Response(null, { status: 405, headers });
    if (Number(request.headers.get('content-length') || 0) > 1024) return new Response(null, { status: 413, headers });

    let payload;
    try {
      const body = await request.text();
      if (body.length > 1024) return new Response(null, { status: 413, headers });
      payload = JSON.parse(body);
    }
    catch { return new Response(null, { status: 400, headers }); }
    const { visitorId, pathname } = payload ?? {};
    if (typeof visitorId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(visitorId) ||
        typeof pathname !== 'string' || pathname.length > 200 || !pathPattern.test(pathname)) {
      return new Response(null, { status: 400, headers });
    }
    if (!env.HASH_SECRET || !env.DB) return new Response(null, { status: 503, headers });

    const { day, firstSeen } = beijingTime();
    const dailyKey = `${day}:${visitorId}:${env.HASH_SECRET}`;
    const visitorHash = hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(dailyKey)));
    const location = locationInChinese(request.cf);
    const ip = connectionIp(request);
    await env.DB.batch([
      env.DB.prepare('INSERT INTO daily_visitors (day, visitor_hash, first_seen, location_zh, ip_address) VALUES (?, ?, ?, ?, ?) ON CONFLICT(day, visitor_hash) DO UPDATE SET location_zh = COALESCE(daily_visitors.location_zh, excluded.location_zh), ip_address = COALESCE(daily_visitors.ip_address, excluded.ip_address)').bind(day, visitorHash, firstSeen, location, ip),
      env.DB.prepare('INSERT INTO daily_pageviews (day, pathname, views) VALUES (?, ?, 1) ON CONFLICT(day, pathname) DO UPDATE SET views = views + 1').bind(day, pathname)
    ]);
    return new Response(null, { status: 204, headers });
  }
};
