const CURRENCIES = {
  USD: {
    fmt:          new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
    income:       175000,
    sliderMin:    17500,
    sliderMax:    35000,
    sliderStep:   500,
    sliderDefault:17500,
    label:        'inflation-adjusted',
  },
  GBP: {
    fmt:          new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }),
    income:       2000,
    sliderMin:    200,
    sliderMax:    400,
    sliderStep:   10,
    sliderDefault:200,
    label:        'historical (1813)',
  },
};

let activeCurrency = 'USD';
function cfg() { return CURRENCIES[activeCurrency]; }

const HOUSEHOLD   = 7;        // total household members
const DEPENDENTS  = 6;        // dependents after death

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

  incomeDisplay:  document.getElementById('incomeDisplay'),
  incomeFormula:  document.getElementById('incomeFormula'),
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

function getChallengeTier(pctOfTarget, target) {
  const fmt = cfg().fmt;
  if (pctOfTarget >= 1.0) {
    return {
      cls: 'challenge-exceptional',
      label: 'Exceptional',
      message: `Each dependent receives ${fmt.format(pctOfTarget * target)}/yr — equal to or better than their current standard of living. Mr. Bennet has fully secured his family.`
    };
  } else if (pctOfTarget >= 0.75) {
    return {
      cls: 'challenge-good',
      label: 'Good',
      message: `Each dependent receives ${fmt.format(pctOfTarget * target)}/yr — close to the current living standard, with modest sacrifice required.`
    };
  } else if (pctOfTarget >= 0.50) {
    return {
      cls: 'challenge-modest',
      label: 'Modest',
      message: `Each dependent receives ${fmt.format(pctOfTarget * target)}/yr — significantly below the current living standard. The family would face real hardship.`
    };
  } else {
    return {
      cls: 'challenge-insufficient',
      label: 'Insufficient',
      message: `Each dependent receives only ${fmt.format(pctOfTarget * target)}/yr — well below what the family needs. This scenario mirrors the novel's feared outcome.`
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
        y: { ticks: { callback: (v) => cfg().fmt.format(v) } }
      }
    }
  });
}

function render() {
  const c      = cfg();
  const income = c.income;
  const target = income / HOUSEHOLD;
  const fmt    = c.fmt;

  // Update dynamic assumption-card text
  els.incomeDisplay.textContent = fmt.format(income) + ` (${c.label})`;
  els.incomeFormula.textContent = fmt.format(income);
  document.querySelectorAll('.target-display').forEach(el => {
    el.textContent = fmt.format(target);
  });

  const pmt       = Number(els.contrib.value);
  const years     = Number(els.years.value);
  const incomeRate = Number(els.incomeRate.value) / 100;
  const saveRate   = incomeRate;   // same rate for growth and income (simplifying assumption)

  els.contribVal.textContent = fmt.format(pmt) + " per year";
  els.contribPct.textContent = "(" + ((pmt / income) * 100).toFixed(1) + "% of income)";
  els.yearsVal.textContent   = years + (years === 1 ? " year" : " years");
  els.peopleVal.textContent  = DEPENDENTS;

  const fv               = futureValueAnnual(pmt, saveRate, years);
  const incomeAnnualTotal = fv * incomeRate;       // perpetuity-style
  const incomePer        = incomeAnnualTotal / DEPENDENTS;
  const pctOfTarget      = incomePer / target;

  els.fv.textContent       = fmt.format(fv);
  els.incomePer.textContent = fmt.format(incomePer) + " / year";

  // Challenge tier
  const tier = getChallengeTier(pctOfTarget, target);
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
- Contribution: ${fmt.format(pmt)}/year (${((pmt / income) * 100).toFixed(1)}% of income)
- Years: ${years}
- Interest rate: ${(incomeRate * 100).toFixed(1)}%
- Dependents: ${DEPENDENTS}

Outputs:
- Accumulated fund: ${fmt.format(fv)}
- Annual income per dependent: ${fmt.format(incomePer)} (${(pctOfTarget * 100).toFixed(0)}% of ${fmt.format(target)} target)
- Challenge result: ${tier.label}`;
}

function switchCurrency(newCurrency) {
  activeCurrency = newCurrency;
  const c = cfg();
  els.contrib.min   = c.sliderMin;
  els.contrib.max   = c.sliderMax;
  els.contrib.step  = c.sliderStep;
  els.contrib.value = c.sliderDefault;
  render();
}

function wire() {
  [els.contrib, els.years, els.incomeRate].forEach(el => {
    el.addEventListener('input', render);
  });

  document.querySelectorAll('input[name="currency"]').forEach(radio => {
    radio.addEventListener('change', e => switchCurrency(e.target.value));
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
