/* ===============================
   SHARED UI COMPONENTS
================================ */

/**
 * Updates the 4 summary cards (Income, Expenses, Savings, Net Balance)
 * Assumes elements with IDs: totalIncome, totalExpenses, totalSavings, netBalance
 */
function updateSummaryCards(income, expense, savings) {
  const net = income - expense + savings;

  const elIncome = document.getElementById('totalIncome');
  const elExpense = document.getElementById('totalExpenses');
  const elSavings = document.getElementById('totalSavings');
  const elNet = document.getElementById('netBalance');

  if (elIncome) elIncome.textContent = formatAmount(income);
  if (elExpense) elExpense.textContent = formatAmount(expense);
  if (elSavings) elSavings.textContent = formatAmount(savings);

  if (elNet) {
    elNet.textContent = formatAmount(net);
    // Remove old classes if generic handling is needed, but typically we just set text
    // Some pages might style it red/green. Let's handle generic red/green if needed?
    // In day.js it doesn't seem to toggle class on the CARD, only in script.js on the LIST.
    // Wait, index.html checks netBalance ID.
    // In script.js: document.getElementById('netBalance').textContent = formatAmount(net);
    // It does NOT change color of the card text in script.js, only in the Month Card list.
  }
}

/**
 * Creates the HTML string for a Month Card
 */
function createMonthCardHTML(year, monthIndex) {
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

  const mData = getTransactionsByMonth(year, monthIndex);
  const inc = sumTransactions(mData, 'income');
  const exp = sumTransactions(mData, 'expense');
  const sav = sumTransactions(mData, 'savings');
  const netM = inc - exp + sav;

  return `
    <div class="month-header">
      <div class="month-title">
        <i class="bi bi-calendar-event"></i>
        <span>${monthNames[monthIndex]}</span>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-box income-box">
        <span class="label">Income</span>
        <span class="value green">${formatAmount(inc)}</span>
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
      <span class="value netBal ${netM < 0 ? 'red' : 'green'}">${formatAmount(netM)}</span>
    </div>

    <div class="details-row">
      <span>Transactions:</span>
      <span class="value">${mData.length}</span>
    </div>
  `;
}

/**
 * Creates a Month Card Element and attaches the click handler
 */
function createMonthCardElement(year, monthIndex) {
  const card = document.createElement('div');
  card.className = 'month-card';
  card.innerHTML = createMonthCardHTML(year, monthIndex);

  card.onclick = () => {
    window.location.href = `day.html?year=${year}&month=${monthIndex}`;
  };

  return card;
}
