// Render the days of the month grid
function renderCalendar(year, month, selectedDate, onDateClick) {
  const grid = document.getElementById('calendarGrid');
  if (!grid) return;

  // Keep day names header
  const dayNames = grid.querySelectorAll('.day-name');
  grid.innerHTML = '';
  dayNames.forEach((day) => grid.appendChild(day));

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Find which days have transactions to highlight marks
  const transactionDates = getTransactionsByYear(year)
    .filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === Number(year) && d.getMonth() === Number(month);
    })
    .map((t) => new Date(t.date).getDate());

  // FIll in previous month's trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = document.createElement('div');
    day.className = 'muted';
    day.textContent = prevMonthDays - i;
    grid.appendChild(day);
  }

  // Fill in current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement('div');
    day.textContent = i;
    day.style.cursor = 'pointer';

    // Highlight today
    const today = new Date();
    if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      day.classList.add('today');
    }

    // Highlight days with transactions
    if (transactionDates.includes(i)) {
      day.style.background = '#a925ebff';
      day.style.color = '#fff';
      day.style.borderRadius = '100%';
      day.style.fontWeight = '600';
    }

    // Highlight currently selected date filter
    if (selectedDate === i) {
      day.style.outline = '2px solid #a925ebff';
      day.style.borderRadius = '100%';
      day.style.outlineOffset = '2px';
    }

    day.onclick = () => onDateClick(i);

    grid.appendChild(day);
  }
}
