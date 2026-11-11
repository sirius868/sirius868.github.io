import assert from 'node:assert/strict';
import { test } from 'node:test';
import { beijingTime } from './time.js';

test('uses the Beijing calendar day across UTC midnight boundaries', () => {
  assert.deepEqual(beijingTime(new Date('2026-11-11T15:59:59Z')), {
    day: '2026-11-11', firstSeen: '2026-11-11T23:59:59+08:00'
  });
  assert.deepEqual(beijingTime(new Date('2026-11-11T16:00:00Z')), {
    day: '2026-11-12', firstSeen: '2026-11-12T00:00:00+08:00'
  });
  assert.deepEqual(beijingTime(new Date('2026-11-12T00:00:00Z')), {
    day: '2026-11-12', firstSeen: '2026-11-12T08:00:00+08:00'
  });
});
