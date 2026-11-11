import assert from 'node:assert/strict';
import { test } from 'node:test';
import { connectionIp } from './ip.js';

const request = (value, cf = {}) => ({ cf, headers: new Headers({ 'cf-connecting-ip': value }) });

test('accepts IPv4 and IPv6 connection addresses', () => {
  assert.equal(connectionIp(request('203.0.113.8')), '203.0.113.8');
  assert.equal(connectionIp(request('2001:db8::1')), '2001:db8::1');
});

test('ignores malformed or untrusted addresses', () => {
  assert.equal(connectionIp(request('203.0.113.999')), null);
  assert.equal(connectionIp(request('203.0.113.8, 192.0.2.2')), null);
  assert.equal(connectionIp(request('not-an-ip')), null);
  assert.equal(connectionIp(request('203.0.113.8', null)), null);
  assert.equal(connectionIp({ headers: new Headers({ 'cf-connecting-ip': '203.0.113.8' }) }), null);
});
