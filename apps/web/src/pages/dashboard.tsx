import { useEffect, useState } from 'react';
import type { SimulationRequest, SimulationResult } from '@futurosimples/types';

export default function Dashboard() {
  const [data, setData] = useState<SimulationResult | null>(null);

  useEffect(() => {
    const payload: SimulationRequest = {
      profile: { risk: 'moderate' },
      income: { base: 4200, variableMean: 600, growthAnnual: 0.03 },
      expenses: { fixed: 2800, variableMean: 900 },
      debts: [],
      goals: [],
      invest: { balance: 0, monthly: 200 }
    };

    fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api') + '/simulation/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <main style={{padding: 24}}>
      <h2>Seu Futuro</h2>
      {!data ? <p>Calculando…</p> : (
        <pre>{JSON.stringify({
          pl5: data.kpis.pl_5y,
          pl10: data.kpis.pl_10y,
          pl20: data.kpis.pl_20y
        }, null, 2)}</pre>
      )}
    </main>
  );
}
