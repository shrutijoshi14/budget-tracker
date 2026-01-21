// Update the 4 main summary cards (Income, Expense, Savings, Net Balance)
function updateSummaryCards(income, expense, savings) {
  const net = income - expense + savings;

  const elIncome = document.getElementById('totalIncome');
  const elExpense = document.getElementById('totalExpenses');
  const elSavings = document.getElementById('totalSavings');
  const elNet = document.getElementById('netBalance');

  // Updating the Income Card
  if (elIncome) elIncome.textContent = formatAmount(income);
  // Updating the Expense Card
  if (elExpense) elExpense.textContent = formatAmount(expense);
  // Updating the Savings Card
  if (elSavings) elSavings.textContent = formatAmount(savings);

  // Updating the Net Balance Card
  if (elNet) {
    elNet.textContent = formatAmount(net);
  }
}

// Generate HTML string for a single month summary card
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

  // Get transactions for this specific month
  const mData = getTransactionsByMonth(year, monthIndex);

  // Calculate totals for Income, Expense, and Savings cards within the month view
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
      <!-- Income Card -->
      <div class="stat-box income-box">
        <span class="label">Income</span>
        <span class="value green">${formatAmount(inc)}</span>
      </div>
      <!-- Expense Card -->
      <div class="stat-box expenses-box">
        <span class="label">Expenses</span>
        <span class="value red">${formatAmount(exp)}</span>
      </div>
      <!-- Savings Card -->
      <div class="stat-box savings-box">
        <span class="label">Savings</span>
        <span class="value blue">${formatAmount(sav)}</span>
      </div>
    </div>

    <hr />

    <div class="details-row">
      <span>Net Balance:</span>
      <!-- Check if balance is negative to apply red color, else green -->
      <span class="value netBal ${netM < 0 ? 'red' : 'green'}">${formatAmount(netM)}</span>
    </div>

    <div class="details-row">
      <span>Transactions:</span>
      <span class="value">${mData.length}</span>
    </div>
  `;
}

// Create the month card DOM element and attach click event
function createMonthCardElement(year, monthIndex) {
  const card = document.createElement('div');
  card.className = 'month-card';
  card.innerHTML = createMonthCardHTML(year, monthIndex);

  // If user clicks the card, navigate to the detailed day view
  card.onclick = () => {
    window.location.href = `day.html?year=${year}&month=${monthIndex}`;
  };

  return card;
}
