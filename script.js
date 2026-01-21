/* ===============================
   MAIN DASHBOARD CONTROLLER
================================ */

function render() {
  const year = getGlobalYear();
  document.getElementById('currentYear').textContent = year;
  document.getElementById('pieYear').textContent = year;

  // Update year labels in cards
  document.querySelectorAll('[id^="yearLabel"]').forEach((el) => {
    el.textContent = year;
  });

  const data = getTransactionsByYear(year);
  const income = sumTransactions(data, 'income');
  const expense = sumTransactions(data, 'expense');
  const savings = sumTransactions(data, 'savings');

  // Use Shared UI Logic
  updateSummaryCards(income, expense, savings);

  // Render Month List
  const monthsBox = document.querySelector('.months');
  monthsBox.innerHTML = '';

  // We can just iterate 0..11 and append cards
  for (let m = 0; m < 12; m++) {
    monthsBox.appendChild(createMonthCardElement(year, m));
  }

  // Update Charts
  updateCharts(year);
}

/* ===============================
   EVENTS
================================ */
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
