export const GIFT_COUNT_KEY = 'giftOpenCounts_v1';

export function loadGiftCounts(): number[] {
  try {
    const raw = localStorage.getItem(GIFT_COUNT_KEY);
    if (!raw) return new Array(10).fill(0);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Array(10).fill(0);
    return parsed.concat(new Array(Math.max(0, 10 - parsed.length)).fill(0)).slice(0, 10);
  } catch (e) {
    return new Array(10).fill(0);
  }
}

export function incrementGiftCount(index: number): number {
  const counts = loadGiftCounts();
  if (index < 0 || index >= counts.length) return 0;
  counts[index] = (counts[index] || 0) + 1;
  try { localStorage.setItem(GIFT_COUNT_KEY, JSON.stringify(counts)); } catch (e) {}
  return counts[index];
}
