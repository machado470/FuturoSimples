import type { SimulationRequest, SimulationResult, TimelinePoint } from '@futurosimples/types';
import { HORIZONS } from './utils/constants';

export function runSimulation(input: SimulationRequest): SimulationResult {
  // MVP: timeline simplificada (sem dívidas) para pl 5/10/20
  const monthlyReturn = 0.006; // placeholder até ligar CDI/alloc
  let balance = input.invest.balance || 0;
  const monthly = input.invest.monthly || 0;

  const timeline: TimelinePoint[] = [];
  const simulateMonths = (n: number) => {
    let b = balance;
    for (let t = 1; t <= n; t++) {
      b = b * (1 + monthlyReturn) + monthly; // aporte + rendimento
      if (t <= 60) timeline.push({ t, netWorth: b, debts: 0, invest: b, cash: 0 });
    }
    balance = b;
    return b;
  };

  const pl5 = simulateMonths(HORIZONS.y5);
  const pl10 = simulateMonths(HORIZONS.y10 - HORIZONS.y5);
  const pl20 = simulateMonths(HORIZONS.y20 - HORIZONS.y10);

  return {
    timeline,
    scenarios: { base: { kpi: {} }, improved: { kpi: {} }, ideal: { kpi: {} } },
    kpis: { pl_5y: pl5, pl_10y: pl10, pl_20y: pl20 }
  } as unknown as SimulationResult;
}
