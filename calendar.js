/* ===============================
  CALENDAR LOGIC
================================ */

function renderCalendar(year, month, selectedDate, onDateClick) {
  const grid = document.getElementById('calendarGrid');
  if (!grid) return;

  // Keep day names
  const dayNames = grid.querySelectorAll('.day-name');
  grid.innerHTML = '';
  dayNames.forEach((day) => grid.appendChild(day));

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Get all transaction dates for this month
  const transactionDates = getTransactionsByYear(year)
    .filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === Number(year) && d.getMonth() === Number(month);
    })
    .map((t) => new Date(t.date).getDate());

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = document.createElement('div');
    day.className = 'muted';
    day.textContent = prevMonthDays - i;
    grid.appendChild(day);
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement('div');
    day.textContent = i;
    day.style.cursor = 'pointer';

    // ✅ TODAY highlight
    const today = new Date();
    if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      day.classList.add('today');
    }

    if (transactionDates.includes(i)) {
      day.style.background = '#a925ebff';
      day.style.color = '#fff';
      day.style.borderRadius = '100%';
      day.style.fontWeight = '600';
    }

    if (selectedDate === i) {
      day.style.outline = '2px solid #a925ebff';
      day.style.borderRadius = '100%';
      day.style.outlineOffset = '2px';
    }

    day.onclick = () => onDateClick(i);

    grid.appendChild(day);
  }
}
