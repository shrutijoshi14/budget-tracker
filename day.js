/* ===============================
   DAY / TRANSACTION CONTROLLER
================================ */

const params = new URLSearchParams(location.search);
let monthParam = params.get('month');
let year = params.has('year') ? +params.get('year') : new Date().getFullYear();
let month = Number(monthParam);

// fallback if month is invalid
if (isNaN(month) || month < 0 || month > 11) {
  month = new Date().getMonth();
}

let selectedDate = null; // Filter by specific day

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

/* ========================= */
function filtered() {
  return getAllTransactions().filter((t) => {
    const d = new Date(t.date);
    if (selectedDate !== null) {
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === selectedDate;
    }
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

function updateCards() {
  let i = 0,
    e = 0,
    s = 0;
  filtered().forEach((t) => {
    if (t.type === 'income') i += t.amount;
    if (t.type === 'expense') e += t.amount;
    if (t.type === 'savings') s += t.amount;
  });

  // Use Shared UI Logic
  updateSummaryCards(i, e, s);
}

function renderAll() {
  // Update Header
  document.getElementById('monthYear').textContent = `${monthNames[month]} ${year}`;
  document.getElementById('pageTitle').textContent = `${monthNames[month]} ${year}`;

  // Render Calendar (Calendar Logic is in calendar.js)
  renderCalendar(year, month, selectedDate, (day) => {
    selectedDate = selectedDate === day ? null : day;
    renderAll();
  });

  // Render Transactions
  renderTransactionsList();

  // Update Cards & Summaries
  updateCards();
  updateSummary();
  updateCategory();
}

/* ========================= */
function renderTransactionsList() {
  const container = document.getElementById('transactionsList');
  const tx = filtered();

  document.getElementById('countBadge').textContent = tx.length;

  if (!tx.length) {
    container.innerHTML = `<p style="padding:20px; text-align:center; color:#64748b;">No transactions found</p>`;
    return;
  }

  container.innerHTML = tx
    .map(
      (t) => `
    <div class="transaction-item">
      <div class="icon-circle">
        <i class="bi bi-tag"></i>
      </div>

      <div class="transaction-info">
        <h3>${t.description}</h3>
        <div class="meta">
          <span class="tag">${t.category}</span>
          <span>${new Date(t.date).toLocaleDateString()}</span>
          <span class="type">${t.type}</span>
        </div>
      </div>

      <div class="transaction-right">
        <span class="amount ${
          t.type === 'income' ? 'green' : t.type === 'expense' ? 'negative' : 'blue'
        }">
          ${t.type === 'expense' ? '-' : '+'}₹${t.amount.toFixed(2)}
        </span>
        <i class="bi bi-pencil" onclick="editTx(${
          t.id
        })" style="cursor:pointer; font-size:18px;"></i>
        <i class="bi bi-trash" onclick="deleteTx(${
          t.id
        })" style="cursor:pointer; font-size:18px; color:#dc2626;"></i>
      </div>
    </div>
  `
    )
    .join('');
}

function updateSummary() {
  const tx = filtered();
  const incomeCount = tx.filter((t) => t.type === 'income').length;
  const expenseCount = tx.filter((t) => t.type === 'expense').length;
  const savingsCount = tx.filter((t) => t.type === 'savings').length;

  const expenseTotal = tx.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const avgExpense = expenseCount > 0 ? expenseTotal / expenseCount : 0;

  document.getElementById('summaryList').innerHTML = `
    <div class="summary-row">
      <span>Total Transactions:</span>
      <span class="black">${tx.length}</span>
    </div>
    <div class="summary-row">
      <span>Income Transactions:</span>
      <span class="green">${incomeCount}</span>
    </div>
    <div class="summary-row">
      <span>Expense Transactions:</span>
      <span class="red">${expenseCount}</span>
    </div>
    <div class="summary-row">
      <span>Savings Transactions:</span>
      <span class="blue">${savingsCount}</span>
    </div>
  `;

  document.getElementById('averageExpense').innerHTML = `
    <span>Average Expense:</span>
    <span class="black">₹${avgExpense.toFixed(2)}</span>
  `;
}

function updateCategory() {
  const box = document.getElementById('categoryBreakdown');
  box.innerHTML = `<h2>Category Breakdown</h2>`;

  const map = {};
  const typeMap = {};

  filtered().forEach((t) => {
    map[t.category] = (map[t.category] || 0) + t.amount;
    typeMap[t.category] = t.type;
  });

  if (Object.keys(map).length === 0) {
    box.innerHTML += `<p style="padding:20px; text-align:center; color:#64748b;">No categories to display</p>`;
    return;
  }

  Object.entries(map).forEach(([c, a]) => {
    const txType = typeMap[c]; // income | expense | savings

    box.innerHTML += `
    <div class="category-row">
      <span class="category-pill ${txType}">${c}</span>
      <div class="category-right">
        <span class="amount">${formatAmount(a)}</span>
        <span class="type">(${txType})</span>
      </div>
    </div>`;
  });
}

function deleteTx(id) {
  if (!confirm('Delete this transaction?')) return;

  const transactions = loadTransactions();
  const index = transactions.findIndex((t) => t.id === id);

  if (index !== -1) {
    transactions.splice(index, 1);
    saveTransactions(transactions);
    renderAll();
  }
}

function editTx(id) {
  location.href = `add-transaction-form.html?edit=${id}`;
}

function changeMonth(delta) {
  month += delta;
  if (month > 11) {
    month = 0;
    year++;
  } else if (month < 0) {
    month = 11;
    year--;
  }
  selectedDate = null;
  const newUrl = `${window.location.pathname}?year=${year}&month=${month}`;
  window.history.pushState({}, '', newUrl);
  renderAll();
}

/* ========================= */
document.getElementById('prevMonth').onclick = () => changeMonth(-1);
document.getElementById('nextMonth').onclick = () => changeMonth(1);

renderAll();
