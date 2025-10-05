import { pmt } from './utils/finance';

export function reverseGoal(target: number, months: number, realRateMonthly: number) {
  return Math.max(0, pmt(realRateMonthly, months, 0, target));
}
