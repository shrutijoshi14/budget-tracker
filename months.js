/* ===============================
   MONTHS OVERVIEW CONTROLLER
================================ */

const monthsContainer = document.getElementById('monthsContainer');

function renderMonths() {
  const currentYear = getGlobalYear();
  document.getElementById('currentYear').textContent = currentYear;
  monthsContainer.innerHTML = '';

  const yearTransactions = getTransactionsByYear(currentYear);

  // Render Month Cards
  // Iterating 0-11
  for (let m = 0; m < 12; m++) {
    monthsContainer.appendChild(createMonthCardElement(currentYear, m));
  }

  updateSummary(yearTransactions);
}

function updateSummary(transactions) {
  const income = sumTransactions(transactions, 'income');
  const expense = sumTransactions(transactions, 'expense');
  const savings = sumTransactions(transactions, 'savings');

  // Use Shared UI Logic
  updateSummaryCards(income, expense, savings);
}

/* YEAR CONTROLS */
document.getElementById('prevYear').onclick = () => {
  setGlobalYear(getGlobalYear() - 1);
  renderMonths();
};

document.getElementById('nextYear').onclick = () => {
  setGlobalYear(getGlobalYear() + 1);
  renderMonths();
};

document.addEventListener('DOMContentLoaded', renderMonths);
