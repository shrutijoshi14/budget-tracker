const KEY = "bt_transactions";
const monthsContainer = document.querySelector( ".months" );

let currentYear =
  Number( localStorage.getItem( "bt_currentYear" ) ) || new Date().getFullYear();

document.getElementById( "currentYear" ).textContent = currentYear;

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getTransactions () {
  return JSON.parse( localStorage.getItem( KEY ) || "[]" );
}

function renderMonths () {
  monthsContainer.innerHTML = "";

  const transactions = getTransactions();

  monthNames.forEach( ( name, monthIndex ) => {
    const monthData = transactions.filter( t => {
      const d = new Date( t.date );
      return d.getFullYear() === currentYear && d.getMonth() === monthIndex;
    } );

    const income = monthData
      .filter( t => t.type === "income" )
      .reduce( ( s, t ) => s + Number( t.amount ), 0 );

    const expense = monthData
      .filter( t => t.type === "expense" )
      .reduce( ( s, t ) => s + Number( t.amount ), 0 );

    const card = document.createElement( "div" );
    card.className = "month-card";

    card.innerHTML = `
      <div class="month-header">
        <div class="month-title">
          <i class="bi bi-calendar-event"></i>
          <span>${ name }</span>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-box income-box">
          <span class="label">Income</span>
          <span class="value green">$${ income }</span>
        </div>
        <div class="stat-box expenses-box">
          <span class="label">Expenses</span>
          <span class="value red">$${ expense }</span>
        </div>
      </div>

      <hr />
      <div class="details-row">
        <span>Transactions:</span>
        <span class="value">${ monthData.length }</span>
      </div>
    `;

    card.onclick = () => {
      window.location.href = `day.html?year=${ currentYear }&month=${ monthIndex }`;
    };

    monthsContainer.appendChild( card );
  } );

  updateSummary( transactions );
}

function updateSummary ( transactions ) {
  const income = transactions
    .filter( t => t.type === "income" )
    .reduce( ( s, t ) => s + Number( t.amount ), 0 );

  const expense = transactions
    .filter( t => t.type === "expense" )
    .reduce( ( s, t ) => s + Number( t.amount ), 0 );

  document.getElementById( "totalIncome" ).textContent = `$${ income }`;
  document.getElementById( "totalExpenses" ).textContent = `$${ expense }`;
  document.getElementById( "totalSavings" ).textContent = `$${ income - expense }`;
}

/* YEAR CONTROLS */
document.getElementById( "prevYear" ).onclick = () => {
  currentYear--;
  localStorage.setItem( "bt_currentYear", currentYear );
  document.getElementById( "currentYear" ).textContent = currentYear;
  renderMonths();
};

document.getElementById( "nextYear" ).onclick = () => {
  currentYear++;
  localStorage.setItem( "bt_currentYear", currentYear );
  document.getElementById( "currentYear" ).textContent = currentYear;
  renderMonths();
};

document.addEventListener( "DOMContentLoaded", renderMonths );
