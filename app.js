const fmtUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const INCOME      = 175000;   // Mr. Bennet's inflation-adjusted annual income
const HOUSEHOLD   = 7;        // total household members
const DEPENDENTS  = 6;        // dependents after death
const TARGET      = INCOME / HOUSEHOLD;   // $25,000 per person per year

const els = {
  contrib:    document.getElementById('contrib'),
  years:      document.getElementById('years'),
  incomeRate: document.getElementById('incomeRate'),

  contribVal: document.getElementById('contribVal'),
  contribPct: document.getElementById('contribPct'),
  yearsVal:   document.getElementById('yearsVal'),
  peopleVal:  document.getElementById('peopleVal'),

  fv:              document.getElementById('fv'),
  incomePer:       document.getElementById('incomePer'),
  challengeResult: document.getElementById('challengeResult'),
  summary:         document.getElementById('summary'),
  copy:            document.getElementById('copy'),
};

function futureValueAnnual(pmtAnnual, annualRate, years) {
  const r = annualRate;
  const n = years;
  if (r === 0) return pmtAnnual * n;
  // ordinary annuity: contributions at end of each year
  return pmtAnnual * ((Math.pow(1 + r, n) - 1) / r);
}

function balanceSeriesByYear(pmtAnnual, annualRate, years) {
  const r = annualRate;
  let bal = 0;
  const points = [];
  for (let y = 1; y <= years; y++) {
    // grow for the year then add contribution (ordinary annuity)
    bal = bal * (1 + r) + pmtAnnual;
    points.push({ year: y, bal });
  }
  return points;
}

function getChallengeTier(pctOfTarget) {
  if (pctOfTarget >= 1.0) {
    return {
      cls: 'challenge-exceptional',
      label: 'Exceptional',
      message: `Each dependent receives ${fmtUSD.format(pctOfTarget * TARGET)}/yr — equal to or better than their current standard of living. Mr. Bennet has fully secured his family.`
    };
  } else if (pctOfTarget >= 0.75) {
    return {
      cls: 'challenge-good',
      label: 'Good',
      message: `Each dependent receives ${fmtUSD.format(pctOfTarget * TARGET)}/yr — close to the current living standard, with modest sacrifice required.`
    };
  } else if (pctOfTarget >= 0.50) {
    return {
      cls: 'challenge-modest',
      label: 'Modest',
      message: `Each dependent receives ${fmtUSD.format(pctOfTarget * TARGET)}/yr — significantly below the current living standard. The family would face real hardship.`
    };
  } else {
    return {
      cls: 'challenge-insufficient',
      label: 'Insufficient',
      message: `Each dependent receives only ${fmtUSD.format(pctOfTarget * TARGET)}/yr — well below what the family needs. This scenario mirrors the novel's feared outcome.`
    };
  }
}

let chart;
function initChart() {
  const ctx = document.getElementById('chart');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{ label: 'Fund Balance', data: [], borderWidth: 2, tension: 0.2 }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Accumulated Fund Balance by Year',
          font: { size: 14 }
        }
      },
      scales: {
        y: { ticks: { callback: (v) => fmtUSD.format(v) } }
      }
    }
  });
}

function render() {
  const pmt       = Number(els.contrib.value);
  const years     = Number(els.years.value);
  const incomeRate = Number(els.incomeRate.value) / 100;
  const saveRate   = incomeRate;   // same rate for growth and income (simplifying assumption)

  els.contribVal.textContent = fmtUSD.format(pmt) + " per year";
  els.contribPct.textContent = "(" + ((pmt / INCOME) * 100).toFixed(1) + "% of income)";
  els.yearsVal.textContent   = years + (years === 1 ? " year" : " years");
  els.peopleVal.textContent  = DEPENDENTS;

  const fv               = futureValueAnnual(pmt, saveRate, years);
  const incomeAnnualTotal = fv * incomeRate;       // perpetuity-style
  const incomePer        = incomeAnnualTotal / DEPENDENTS;
  const pctOfTarget      = incomePer / TARGET;

  els.fv.textContent       = fmtUSD.format(fv);
  els.incomePer.textContent = fmtUSD.format(incomePer) + " / year";

  // Challenge tier
  const tier = getChallengeTier(pctOfTarget);
  els.challengeResult.className = 'challenge-box ' + tier.cls;
  els.challengeResult.innerHTML =
    `<strong>${tier.label}</strong> (${(pctOfTarget * 100).toFixed(0)}% of target): ${tier.message}`;

  // Chart
  const series = balanceSeriesByYear(pmt, saveRate, years);
  chart.data.labels              = series.map(p => `Year ${p.year}`);
  chart.data.datasets[0].data    = series.map(p => p.bal);
  chart.update();

  // Summary text
  els.summary.textContent =
`Inputs:
- Contribution: ${fmtUSD.format(pmt)}/year (${((pmt / INCOME) * 100).toFixed(1)}% of income)
- Years: ${years}
- Interest rate: ${(incomeRate * 100).toFixed(1)}%
- Dependents: ${DEPENDENTS}

Outputs:
- Accumulated fund: ${fmtUSD.format(fv)}
- Annual income per dependent: ${fmtUSD.format(incomePer)} (${(pctOfTarget * 100).toFixed(0)}% of $${TARGET.toLocaleString()} target)
- Challenge result: ${tier.label}`;
}

function wire() {
  [els.contrib, els.years, els.incomeRate].forEach(el => {
    el.addEventListener('input', render);
  });

  els.copy.addEventListener('click', async () => {
    await navigator.clipboard.writeText(els.summary.textContent);
    els.copy.textContent = 'Copied!';
    setTimeout(() => { els.copy.textContent = 'Copy summary'; }, 1500);
  });
}

initChart();
wire();
render();
