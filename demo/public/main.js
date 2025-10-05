document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('simulation-form');
  const resultsDiv = document.getElementById('results');
  let chart;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const renda = parseFloat(document.getElementById('renda').value) || 0;
    const gastos = parseFloat(document.getElementById('gastos').value) || 0;
    const saldo = parseFloat(document.getElementById('divida-saldo').value) || 0;
    const taxaPercent = parseFloat(document.getElementById('divida-taxa').value) || 0;
    const parcela = parseFloat(document.getElementById('divida-parcela').value) || 0;
    const perfil = document.getElementById('perfil').value;

    const debts = [];
    if (saldo > 0) {
      // Convert percentage to decimal (e.g., 2.5% -> 0.025)
      debts.push({ saldo: saldo, taxa: taxaPercent / 100, parcela: parcela });
    }

    const body = { renda: renda, gastos: gastos, debts: debts, perfil: perfil };

    try {
      const response = await fetch('/api/simulation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();

      // Build results summary
      let html = '<h2>Resultados</h2>';
      html += '<h3>Base</h3>';
      html += `<p>5 anos: R$ ${data.base.summary.pl_5_anos.toFixed(2)}</p>`;
      html += `<p>10 anos: R$ ${data.base.summary.pl_10_anos.toFixed(2)}</p>`;
      html += `<p>20 anos: R$ ${data.base.summary.pl_20_anos.toFixed(2)}</p>`;
      html += '<h3>Melhorado</h3>';
      html += `<p>5 anos: R$ ${data.melhorado.summary.pl_5_anos.toFixed(2)}</p>`;
      html += `<p>10 anos: R$ ${data.melhorado.summary.pl_10_anos.toFixed(2)}</p>`;
      html += `<p>20 anos: R$ ${data.melhorado.summary.pl_20_anos.toFixed(2)}</p>`;
      html += '<h3>Ideal</h3>';
      html += `<p>5 anos: R$ ${data.ideal.summary.pl_5_anos.toFixed(2)}</p>`;
      html += `<p>10 anos: R$ ${data.ideal.summary.pl_10_anos.toFixed(2)}</p>`;
      html += `<p>20 anos: R$ ${data.ideal.summary.pl_20_anos.toFixed(2)}</p>`;
      resultsDiv.innerHTML = html;

      // Prepare chart data
      const ctx = document.getElementById('chart').getContext('2d');
      const labels = data.base.timeline.map((_, idx) => idx + 1);
      const baseData = data.base.timeline.map(item => item.patrimonio);
      const melhoradoData = data.melhorado.timeline.map(item => item.patrimonio);
      const idealData = data.ideal.timeline.map(item => item.patrimonio);

      if (chart) {
        chart.destroy();
      }
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Base',
              data: baseData,
              borderWidth: 1,
              fill: false
            },
            {
              label: 'Melhorado',
              data: melhoradoData,
              borderWidth: 1,
              fill: false
            },
            {
              label: 'Ideal',
              data: idealData,
              borderWidth: 1,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } catch (err) {
      resultsDiv.innerHTML = '<p>Erro ao processar a simulação.</p>';
      console.error(err);
    }
  });
});
