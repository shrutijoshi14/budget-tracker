const KEY = "bt_transactions";
const YEAR_KEY = "bt_currentYear";

const monthsContainer = document.getElementById( "monthsContainer" );

let currentYear = Number( localStorage.getItem( YEAR_KEY ) ) || new Date().getFullYear();

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function loadTransactions () {
  return JSON.parse( localStorage.getItem( KEY ) ) || [];
}

function normalizeTransaction ( tx ) {
  return {
    id: tx.id,
    description: tx.description || "Untitled",
    type: tx.type || "",
    category: tx.category || "",
    date: tx.date || "",
    amount: Number( tx.amount || 0 )
  };
}


function getTransactions () {
  return loadTransactions().map( normalizeTransaction );
}

function getByYear ( year ) {
  return getTransactions().filter( t => new Date( t.date ).getFullYear() === year );
}

function getByMonth ( year, month ) {
  return getTransactions().filter( t => {
    const d = new Date( t.date );
    return d.getFullYear() === year && d.getMonth() === month;
  } );
}

function sum ( list, type ) {
  return list
    .filter( t => t.type === type )
    .reduce( ( s, t ) => s + Number( t.amount ), 0 );
}

function renderMonths () {
  document.getElementById( "currentYear" ).textContent = currentYear;
  monthsContainer.innerHTML = "";

  const yearTransactions = getByYear( currentYear );

  monthNames.forEach( ( name, monthIndex ) => {
    const monthData = getByMonth( currentYear, monthIndex );

    const income = sum( monthData, "income" );
    const expense = sum( monthData, "expense" );
    const savings = sum( monthData, "savings" );
    const net = income - expense + savings;

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
          <span class="value green">₹${ income.toFixed( 2 ) }</span>
        </div>
        <div class="stat-box expenses-box">
          <span class="label">Expenses</span>
          <span class="value red">₹${ expense.toFixed( 2 ) }</span>
        </div>
        <div class="stat-box savings-box">
          <span class="label">Savings</span>
          <span class="value blue">₹${ savings.toFixed( 2 ) }</span>
        </div>
      </div>

      <hr />

      <div class="details-row">
        <span>Net Balance:</span>
        <span class="value ${ net < 0 ? 'red' : 'green' }">₹${ net.toFixed( 2 ) }</span>
      </div>

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

  updateSummary( yearTransactions );
}

function updateSummary ( transactions ) {
  const income = sum( transactions, "income" );
  const expense = sum( transactions, "expense" );
  const savings = sum( transactions, "savings" );
  const net = income - expense + savings;

  document.getElementById( "totalIncome" ).textContent = `₹${ income.toFixed( 2 ) }`;
  document.getElementById( "totalExpenses" ).textContent = `₹${ expense.toFixed( 2 ) }`;
  document.getElementById( "totalSavings" ).textContent = `₹${ savings.toFixed( 2 ) }`;
  document.getElementById( "netBalance" ).textContent = `₹${ net.toFixed( 2 ) }`;
}

/* YEAR CONTROLS */
document.getElementById( "prevYear" ).onclick = () => {
  currentYear--;
  localStorage.setItem( YEAR_KEY, currentYear );
  renderMonths();
};

document.getElementById( "nextYear" ).onclick = () => {
  currentYear++;
  localStorage.setItem( YEAR_KEY, currentYear );
  renderMonths();
};

document.addEventListener( "DOMContentLoaded", renderMonths );
