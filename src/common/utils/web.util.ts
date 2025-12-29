export function getIp(request: any) {
  const forwardedFor = request.headers['x-forwarded-for'];
  if (forwardedFor) {
    const tempIp = (
      Array.isArray(forwardedFor) ? forwardedFor[0] : String(forwardedFor)
    )
      .split(',')[0]
      .trim();
    return normalizeIp(tempIp);
  }

  const realIp = request.headers['x-real-ip'];
  if (realIp) {
    const tempIp = Array.isArray(realIp) ? realIp[0] : String(realIp);
    return normalizeIp(tempIp);
  }

  const ip =
    request.ip ||
    request.socket?.remoteAddress ||
    request.connection?.remoteAddress;
  return normalizeIp(ip || '');
}

export function normalizeIp(ip: string): string {
  if (!ip) return '';
  if (ip.startsWith('::ffff:')) return ip.substring(7);
  if (ip === '::1') return '127.0.0.1';
  if (ip.includes('%')) ip = ip.split('%')[0];
  return ip;
}
