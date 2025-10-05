/**
 * FuturoSimples simulation engine
 *
 * This module exports a function runSimulations which accepts a user profile
 * and returns three scenarios (base, melhorado, ideal). The logic is simplified
 * but demonstrates debt amortization, spending cuts and investment growth.
 */

function getInvestRate(profile) {
  switch (profile) {
    case 'conservador':
      return 0.004;
    case 'arrojado':
      return 0.009;
    case 'moderado':
    default:
      return 0.006;
  }
}

function cloneDebts(debts) {
  return (debts || []).map(d => ({
    saldo: Number(d.saldo),
    taxa: Number(d.taxa),
    parcela: Number(d.parcela),
    tipo: d.tipo || 'divida'
  }));
}

function simulateScenario(user, cutPercent, extraDebtPercent) {
  const annualGrowth = Number(user.crescimento_renda_anual) || 0;
  const growthFactor = Math.pow(1 + annualGrowth, 1 / 12);
  let rendaBase = Number(user.renda_base) || 0;
  let rendaVariavel = Number(user.renda_variavel) || 0;
  const fixedExpenses = Number(user.gastos_fixos) || 0;
  const variableExpenses = Number(user.gastos_variaveis) || 0;
  const investRate = getInvestRate(user.perfil);
  let investBalance = Number(user.saldo_investido) || 0;
  let aporteMensalExtra = Number(user.aporte_mensal) || 0;
  const debts = cloneDebts(user.dividas);
  const timeline = [];
  let debtFreeMonth = null;
  for (let month = 1; month <= 240; month++) {
    const rendaTotal = (rendaBase * Math.pow(growthFactor, month - 1)) + rendaVariavel;
    let totalMandatoryDebtPayment = 0;
    // accrue interest and pay minimum
    for (const d of debts) {
      if (d.saldo <= 0) continue;
      d.saldo += d.saldo * d.taxa;
      const payment = Math.min(d.parcela, d.saldo);
      d.saldo -= payment;
      totalMandatoryDebtPayment += payment;
    }
    // sort debts by interest rate for avalanche
    debts.sort((a, b) => b.taxa - a.taxa);
    const adjustedVariable = variableExpenses * (1 - cutPercent);
    const totalExpenses = fixedExpenses + adjustedVariable;
    let surplus = rendaTotal - totalExpenses - totalMandatoryDebtPayment;
    // subtract fixed aporte
    surplus -= aporteMensalExtra;
    let investThisMonth = 0;
    let extraDebtPaymentBudget = 0;
    if (surplus > 0) {
      extraDebtPaymentBudget = surplus * extraDebtPercent;
      investThisMonth = surplus - extraDebtPaymentBudget;
    }
    // apply extra debt payments
    let extra = extraDebtPaymentBudget;
    for (const d of debts) {
      if (extra <= 0) break;
      if (d.saldo <= 0) continue;
      const payAmount = Math.min(extra, d.saldo);
      d.saldo -= payAmount;
      extra -= payAmount;
    }
    investBalance = investBalance * (1 + investRate) + investThisMonth + aporteMensalExtra;
    const totalDebt = debts.reduce((sum, d) => sum + Math.max(d.saldo, 0), 0);
    if (!debtFreeMonth && totalDebt <= 0.01) {
      debtFreeMonth = month;
    }
    const patrimonio = investBalance - totalDebt;
    timeline.push({ month, patrimonio, investBalance, totalDebt });
  }
  function summaryAt(years) {
    const idx = years * 12 - 1;
    const pt = timeline[idx] || {};
    return {
      patrimonio: Number(((pt.patrimonio || 0).toFixed(2))),
      invest: Number(((pt.investBalance || 0).toFixed(2))),
      debt: Number(((pt.totalDebt || 0).toFixed(2)))
    };
  }
  return {
    timeline,
    summary: {
      at5: summaryAt(5),
      at10: summaryAt(10),
      at20: summaryAt(20)
    },
    debtFreeMonth
  };
}

function runSimulations(userData) {
  const base = simulateScenario(userData, 0, 0);
  const melhorado = simulateScenario(userData, 0.1, 0.25);
  const ideal = simulateScenario(userData, 0.2, 0.5);
  return { base, melhorado, ideal };
}

module.exports = { runSimulations };
