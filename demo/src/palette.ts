function mix(a: string, b: string, t: number): string {
  const x = [1, 3, 5].map((i) => {
    const p = parseInt(a.slice(i, i + 2), 16);
    const q = parseInt(b.slice(i, i + 2), 16);
    return Math.round(p + (q - p) * t)
      .toString(16)
      .padStart(2, '0');
  });
  return `#${x.join('')}`;
}

export const PALETTE_BASES: Array<[string, string]> = [
  ['Primary', '#0B5CAD'],
  ['Secondary', '#005C8F'],
  ['Tertiary', '#DCEBFA'],
  ['Neutral', '#F6F8FB'],
];

export function buildScale(hex: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < 11; i++) {
    if (i < 5) out.push(mix(hex, '#000000', ((5 - i) / 5) * 0.95));
    else if (i === 5) out.push(hex);
    else out.push(mix(hex, '#ffffff', ((i - 5) / 5) * 0.95));
  }
  return out;
}
