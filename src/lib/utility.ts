export const minmax = ({ min, max, val }: { min?: number; max?: number; val: number }) => {
  if (min !== undefined && val < min) return min;
  if (max !== undefined && val > max) return max;
  return val;
};
export const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
