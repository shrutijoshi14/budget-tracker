/* ===============================
   GLOBAL STORAGE KEYS & HELPERS
================================ */
const KEY = 'bt_transactions';
const YEAR_KEY = 'bt_currentYear';

function loadTransactions() {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

function saveTransactions(transactions) {
  localStorage.setItem(KEY, JSON.stringify(transactions));
}

function normalizeTransaction(tx) {
  return {
    id: tx.id,
    description: tx.description || tx.item || 'Untitled',
    type: tx.type || tx.transactionType || '',
    category: tx.category || tx.categoryName || '',
    date: tx.date || tx.transactionDate || '',
    amount: Number(tx.amount || 0),
  };
}

function getByYear(year) {
  return loadTransactions()
    .map(normalizeTransaction)
    .filter((t) => new Date(t.date).getFullYear() === Number(year));
}

function getByMonth(year, month) {
  return loadTransactions()
    .map(normalizeTransaction)
    .filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === Number(year) && d.getMonth() === Number(month);
    });
}

function sum(list, type) {
  return list.filter((t) => t.type === type).reduce((s, t) => s + Number(t.amount), 0);
}

/* ===============================
  CURRENT YEAR HANDLING
================================ */
function currentYear() {
  return Number(localStorage.getItem(YEAR_KEY)) || new Date().getFullYear();
}

function setYear(year) {
  localStorage.setItem(YEAR_KEY, year);
  render();
}

/* ===============================
  CHART INITIALIZATION
================================ */
const monthlyCtx = document.getElementById('monthlyChart');
const pieCtx = document.getElementById('expensePie');

let monthlyChart = new Chart(monthlyCtx, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Income',
        data: [],
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgb(75,192,192)',
        borderWidth: 2,
      },
      {
        label: 'Expenses',
        data: [],
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgb(255,99,132)',
        borderWidth: 2,
      },
      {
        label: 'Net Savings',
        data: [],
        backgroundColor: 'rgba(54,162,235,0.2)',
        borderColor: 'rgb(54,162,235)',
        borderWidth: 2,
      },
    ],
  },
  options: {
    scales: { y: { beginAtZero: true } },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
        mode: 'index',
        intersect: false,
        external: function (context) {
          const tooltipModel = context.tooltip;
          const tooltipEl = document.getElementById('customTooltip');

          if (tooltipModel.opacity === 0) {
            tooltipEl.style.display = 'none';
            return;
          }

          const month = tooltipModel.title[0];
          const income = tooltipModel.dataPoints[0].raw;
          const expenses = tooltipModel.dataPoints[1].raw;
          const savings = tooltipModel.dataPoints[2].raw;

          tooltipEl.innerHTML = `
            <div class="month">${month}</div>
            <div class="income">Income: ₹${income.toFixed(2)}</div>
            <div class="expenses">Expenses: ₹${expenses.toFixed(2)}</div>
            <div class="savings">Net Savings: ₹${savings.toFixed(2)}</div>
          `;

          const position = context.chart.canvas.getBoundingClientRect();
          tooltipEl.style.left =
            position.left + window.pageXOffset + tooltipModel.caretX + 20 + 'px';
          tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - 20 + 'px';
          tooltipEl.style.display = 'block';
        },
      },
    },
  },
});

let pieChart = new Chart(pieCtx, {
  type: 'pie',
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          'rgba(255,99,132,0.6)',
          'rgba(255,159,64,0.6)',
          'rgba(255,205,86,0.6)',
          'rgba(75,192,192,0.6)',
          'rgba(54,162,235,0.6)',
          'rgba(153,102,255,0.6)',
        ],
        borderColor: [
          'rgb(255,99,132)',
          'rgb(255,159,64)',
          'rgb(255,205,86)',
          'rgb(75,192,192)',
          'rgb(54,162,235)',
          'rgb(153,102,255)',
        ],
        borderWidth: 2,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return label + ': ₹' + value.toFixed(2);
          },
        },
      },
    },
  },
});

/* ===============================
  CHART DATA UPDATES
================================ */
function updateMonthlyChart(year) {
  const incomeArr = [];
  const expenseArr = [];
  const savingsArr = [];

  let total = 0;

  for (let m = 0; m < 12; m++) {
    const data = getByMonth(year, m);
    const income = sum(data, 'income');
    const expense = sum(data, 'expense');
    const savings = sum(data, 'savings');

    incomeArr.push(income);
    expenseArr.push(expense);
    savingsArr.push(income - expense + savings);

    total += income + expense + savings;
  }

  const canvas = document.getElementById('monthlyChart');
  const placeholder = document.getElementById('monthlyPlaceholder');

  if (total === 0) {
    canvas.style.display = 'none';
    placeholder.style.display = 'flex';
    return;
  }

  canvas.style.display = 'block';
  placeholder.style.display = 'none';

  monthlyChart.data.datasets[0].data = incomeArr;
  monthlyChart.data.datasets[1].data = expenseArr;
  monthlyChart.data.datasets[2].data = savingsArr;
  monthlyChart.update();
}

function updatePieChart(year) {
  const data = getByYear(year).filter((t) => t.type === 'expense');
  const categories = {};

  data.forEach((t) => {
    categories[t.category] = (categories[t.category] || 0) + t.amount;
  });

  const values = Object.values(categories);
  const hasData = values.some((v) => v > 0);

  const canvas = document.getElementById('expensePie');
  const placeholder = document.getElementById('piePlaceholder');

  if (!hasData) {
    canvas.style.display = 'none';
    placeholder.style.display = 'flex';
    return;
  }

  canvas.style.display = 'block';
  placeholder.style.display = 'none';

  pieChart.data.labels = Object.keys(categories);
  pieChart.data.datasets[0].data = values;
  pieChart.update();
}

/* ===============================
   MAIN RENDER FUNCTION
================================ */
function render() {
  const year = currentYear();
  document.getElementById('currentYear').textContent = year;
  document.getElementById('pieYear').textContent = year;

  // Update year labels in cards
  document.querySelectorAll('[id^="yearLabel"]').forEach((el) => {
    el.textContent = year;
  });

  const data = getByYear(year);
  const income = sum(data, 'income');
  const expense = sum(data, 'expense');
  const savings = sum(data, 'savings');
  const net = income - expense + savings;

  document.getElementById('totalIncome').textContent = formatAmount(income);
  document.getElementById('totalExpenses').textContent = formatAmount(expense);
  document.getElementById('totalSavings').textContent = formatAmount(savings);
  document.getElementById('netBalance').textContent = formatAmount(net);

  const monthsBox = document.querySelector('.months');
  monthsBox.innerHTML = '';

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  for (let m = 0; m < 12; m++) {
    const mData = getByMonth(year, m);
    const inc = sum(mData, 'income');
    const exp = sum(mData, 'expense');
    const sav = sum(mData, 'savings');
    const netM = inc - exp + sav;

    const card = document.createElement('div');
    card.className = 'month-card';
    card.innerHTML = `
      <div class="month-header">
        <div class="month-title">
          <i class="bi bi-calendar-event"></i>
          <span>${monthNames[m]}</span>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-box income-box">
          <span class="label">Income</span>
          <span class="value green">${formatAmount(income)}</span>
        </div>
        <div class="stat-box expenses-box">
          <span class="label">Expenses</span>
          <span class="value red">${formatAmount(exp)}</span>
        </div>
        <div class="stat-box savings-box">
          <span class="label">Savings</span>
          <span class="value blue">${formatAmount(sav)}</span>
        </div>
      </div>

      <hr />

      <div class="details-row">
        <span>Net Balance:</span>
        <span class="value netBal ${net < 0 ? 'red' : 'green'}">${formatAmount(net)}</span>
      </div>

      <div class="details-row">
        <span>Transactions:</span>
        <span class="value">${mData.length}</span>
      </div>
    `;

    card.onclick = () => {
      window.location.href = `day.html?year=${year}&month=${m}`;
    };

    monthsBox.appendChild(card);
  }

  updateMonthlyChart(year);
  updatePieChart(year);
}

/* ===============================
   EVENTS
================================ */
document.getElementById('prevYear').onclick = () => setYear(currentYear() - 1);
document.getElementById('nextYear').onclick = () => setYear(currentYear() + 1);

document.addEventListener('DOMContentLoaded', render);
