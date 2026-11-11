import assert from 'node:assert/strict';
import { test } from 'node:test';
import { locationInChinese } from './location.js';
import worker from './index.js';

test('stores only names that can be written in Chinese', () => {
  assert.equal(locationInChinese({ country: 'CN', regionCode: 'GD', city: 'Guangzhou' }), '中国 · 广东省 · 广州市');
  assert.equal(locationInChinese({ country: 'CN', region: 'Guangdong', city: 'Unknown City' }), '中国 · 广东省');
  assert.equal(locationInChinese({ country: 'US', region: 'California', city: 'San Francisco' }), '美国');
  assert.equal(locationInChinese({ country: 'XX', city: 'Unknown City' }), null);
  assert.equal(locationInChinese(undefined), null);
});

test('collector writes the coarse location and validated connection IP', async () => {
  const statements = [];
  const env = {
    HASH_SECRET: 'local-test-secret',
    DB: {
      prepare(sql) { return { bind(...args) { const statement = { sql, args }; statements.push(statement); return statement; } }; },
      async batch() {}
    }
  };
  const request = new Request('https://collector.example/', {
    method: 'POST',
    headers: { origin: 'https://sirius868.github.io', 'content-type': 'application/json', 'cf-connecting-ip': '203.0.113.8' },
    body: JSON.stringify({ visitorId: 'e90fb2c3-720f-4d52-8470-c8fb2b8c7f18', pathname: '/blog/' })
  });
  Object.defineProperty(request, 'cf', { value: { country: 'CN', regionCode: 'GD', city: 'Guangzhou' } });
  const response = await worker.fetch(request, env);
  assert.equal(response.status, 204);
  assert.match(statements[0].sql, /first_seen, location_zh, ip_address/);
  assert.match(statements[0].args[2], /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  assert.equal(statements[0].args[3], '中国 · 广东省 · 广州市');
  assert.equal(statements[0].args[4], '203.0.113.8');
  assert.equal(statements[0].args[0], statements[0].args[2].slice(0, 10));
  assert.equal(statements[1].args[1], '/blog/');
});
