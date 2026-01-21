let monthlyChart;
let pieChart;

// Initialize the bar and pie charts configuration
function initCharts() {
  const monthlyCtx = document.getElementById('monthlyChart');
  const pieCtx = document.getElementById('expensePie');

  if (!monthlyCtx || !pieCtx) return;

  // Monthly Income/Expense/Savings Bar Chart
  monthlyChart = new Chart(monthlyCtx, {
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
            tooltipEl.style.top =
              position.top + window.pageYOffset + tooltipModel.caretY - 20 + 'px';
            tooltipEl.style.display = 'block';
          },
        },
      },
    },
  });

  // Expense Categories Pie Chart
  pieChart = new Chart(pieCtx, {
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
}

// Update charts with data for the selected year
function updateCharts(year) {
  if (!monthlyChart || !pieChart) return;

  // Monthly Chart Update
  const incomeArr = [];
  const expenseArr = [];
  const savingsArr = [];
  let total = 0;

  for (let m = 0; m < 12; m++) {
    const data = getTransactionsByMonth(year, m);
    const income = sumTransactions(data, 'income');
    const expense = sumTransactions(data, 'expense');
    const savings = sumTransactions(data, 'savings');

    incomeArr.push(income);
    expenseArr.push(expense);
    savingsArr.push(income - expense + savings);

    total += income + expense + savings;
  }

  const mCanvas = document.getElementById('monthlyChart');
  const mPlaceholder = document.getElementById('monthlyPlaceholder');

  // Show placeholder if no data exists
  if (total === 0) {
    mCanvas.style.display = 'none';
    mPlaceholder.style.display = 'flex';
  } else {
    mCanvas.style.display = 'block';
    mPlaceholder.style.display = 'none';
    monthlyChart.data.datasets[0].data = incomeArr;
    monthlyChart.data.datasets[1].data = expenseArr;
    monthlyChart.data.datasets[2].data = savingsArr;
    monthlyChart.update();
  }

  // Pie Chart Update
  const data = getTransactionsByYear(year).filter((t) => t.type === 'expense');
  const categories = {};

  // Aggregate expenses by category
  data.forEach((t) => {
    categories[t.category] = (categories[t.category] || 0) + t.amount;
  });

  const values = Object.values(categories);
  const hasData = values.some((v) => v > 0);

  const pCanvas = document.getElementById('expensePie');
  const pPlaceholder = document.getElementById('piePlaceholder');

  if (!hasData) {
    pCanvas.style.display = 'none';
    pPlaceholder.style.display = 'flex';
  } else {
    pCanvas.style.display = 'block';
    pPlaceholder.style.display = 'none';
    pieChart.data.labels = Object.keys(categories);
    pieChart.data.datasets[0].data = values;
    pieChart.update();
  }
}
