export function circleHit(a, b, ar = a.r, br = b.r) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const rr = ar + br;
  return dx * dx + dy * dy < rr * rr;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
