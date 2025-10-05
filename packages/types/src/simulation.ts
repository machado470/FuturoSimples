export type Risk = 'conservative'|'moderate'|'aggressive';
export type Profile = { risk: Risk };

export type SimulationRequest = {
  profile: Profile;
  income: { base: number; variableMean?: number; growthAnnual?: number };
  expenses: { fixed: number; variableMean?: number };
  debts: any[]; // detalhar depois
  goals: any[]; // detalhar depois
  invest: { balance?: number; monthly?: number };
};

export type TimelinePoint = { t: number; netWorth: number; debts: number; invest: number; cash: number };

export type SimulationResult = {
  timeline: TimelinePoint[];
  scenarios: any;
  kpis: { pl_5y: number; pl_10y: number; pl_20y: number };
};
