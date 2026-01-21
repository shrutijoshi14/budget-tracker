// Main Dashboard rendering controller
function render() {
  const year = getGlobalYear();
  document.getElementById('currentYear').textContent = year;
  document.getElementById('pieYear').textContent = year;

  // Update year labels in summary cards
  document.querySelectorAll('[id^="yearLabel"]').forEach((el) => {
    el.textContent = year;
  });

  // Calculate totals for the year
  const data = getTransactionsByYear(year);
  const income = sumTransactions(data, 'income');
  const expense = sumTransactions(data, 'expense');
  const savings = sumTransactions(data, 'savings');

  // Passing data to update Income, Expense, and Savings Cards
  updateSummaryCards(income, expense, savings);

  // Render Month List
  const monthsBox = document.querySelector('.months');
  monthsBox.innerHTML = '';

  // Create card for each month (0-11) by looping through all months
  for (let m = 0; m < 12; m++) {
    monthsBox.appendChild(createMonthCardElement(year, m));
  }

  // Update Charts (Bar Chart for monthly breakdown, Pie Chart for expenses)
  updateCharts(year);
}

document.getElementById('prevYear').onclick = () => {
  setGlobalYear(getGlobalYear() - 1);
  render();
};
document.getElementById('nextYear').onclick = () => {
  setGlobalYear(getGlobalYear() + 1);
  render();
};

document.addEventListener('DOMContentLoaded', () => {
  initCharts(); // Initialize charts first
  render(); // Render data
});
