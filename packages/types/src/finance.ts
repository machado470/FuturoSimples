export type Debt = { type: 'card'|'loan'|'mortgage'; balance: number; rateAm: number; installment?: number };
export type Goal = { name: string; target: number; months: number; priority?: number };

export type Income = { base: number; variableMean?: number; growthAnnual?: number };
export type Expenses = { fixed: number; variableMean?: number };
export type Invest = { balance?: number; monthly?: number };
