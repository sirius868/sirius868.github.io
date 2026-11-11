export function connectionIp(request) {
  if (!request.cf) return null;
  const value = request.headers.get('cf-connecting-ip')?.trim();
  if (!value || value.length > 45) return null;

  if (value.includes(':')) {
    try {
      const parsed = new URL(`http://[${value}]/`);
      return parsed.hostname.slice(1, -1);
    } catch { return null; }
  }

  const octets = value.split('.');
  if (octets.length !== 4 || octets.some((part) => !/^(0|[1-9]\d{0,2})$/.test(part) || Number(part) > 255)) return null;
  return value;
}
