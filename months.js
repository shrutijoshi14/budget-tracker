const monthsContainer = document.getElementById('monthsContainer');

// Render the detailed Month Overview page
function renderMonths() {
  const currentYear = getGlobalYear();
  document.getElementById('currentYear').textContent = currentYear;
  monthsContainer.innerHTML = '';

  const yearTransactions = getTransactionsByYear(currentYear);

  // Generate a card for each month
  for (let m = 0; m < 12; m++) {
    monthsContainer.appendChild(createMonthCardElement(currentYear, m));
  }

  updateSummary(yearTransactions);
}

// Update the summary cards for the selected year
function updateSummary(transactions) {
  const income = sumTransactions(transactions, 'income');
  const expense = sumTransactions(transactions, 'expense');
  const savings = sumTransactions(transactions, 'savings');

  updateSummaryCards(income, expense, savings);
}

document.getElementById('prevYear').onclick = () => {
  setGlobalYear(getGlobalYear() - 1);
  renderMonths();
};

document.getElementById('nextYear').onclick = () => {
  setGlobalYear(getGlobalYear() + 1);
  renderMonths();
};

document.addEventListener('DOMContentLoaded', renderMonths);
