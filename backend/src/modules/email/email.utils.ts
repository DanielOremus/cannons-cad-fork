/** 
    Formats ttl to user friendly text
    @param {number} ttl - The expiration time in seconds
*/
export function formatTtl(ttl: number) {
  const hours = ttl / 3600;
  if (hours >= 1) {
    return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hour(s)`;
  } else {
    const minutes = ttl / 60;
    return `${Math.round(minutes)} minute(s)`;
  }
}
