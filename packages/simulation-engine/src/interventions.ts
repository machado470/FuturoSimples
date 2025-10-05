export type Intervention = { title: string; impactBRL: number; effort: 'low'|'mid'|'high' };
export function suggestInterventions(): Intervention[] {
  return [
    { title: 'Corte 10% do delivery', impactBRL: 45000, effort: 'mid' },
    { title: 'Aumente aporte em R$ 100/m', impactBRL: 32000, effort: 'low' }
  ];
}
