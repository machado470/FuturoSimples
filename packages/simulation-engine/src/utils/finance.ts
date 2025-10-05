export const amFromAa = (aa: number) => Math.pow(1 + aa, 1 / 12) - 1;
export const pmt = (i: number, n: number, pv: number, fv: number) => {
  // PMT clássico com i mensal
  if (i === 0) return (fv - pv) / n;
  return (i * (fv - pv * Math.pow(1 + i, n))) / (Math.pow(1 + i, n) - 1);
};
