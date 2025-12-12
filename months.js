/* ------------------ MONTHS DATA (EDITABLE) ------------------ */
// Leave empty if month has no data
const monthsData = [
  { month: "January", income: 0, expenses: 35, transactions: 1 },
  { month: "February", income: 0 },
  { month: "March", income: 0 },
  { month: "April", income: 0 },
  { month: "May", income: 0 },
  { month: "June", income: 0 },
  { month: "July", income: 0 },
  { month: "August", income: 0 },
  { month: "September", income: 0, expenses: 500, transactions: 1 },
  { month: "October", income: 50000, expenses: 0, transactions: 1 },
  { month: "November", income: 0, expenses: 100 },
  { month: "December", income: 2000, expenses: 50, transactions: 2 }
];

// Normalize missing fields
monthsData.forEach( m => {
  m.income = m.income ?? 0;
  m.expenses = m.expenses ?? 0;
  m.transactions = m.transactions ?? 0;
  m.savings = m.savings ?? ( m.income - m.expenses );
} );

/* ------------------------------------------------------------- */
/* ------------------ GENERATE MONTH CARDS --------------------- */
/* ------------------------------------------------------------- */

function loadMonthCards () {
  const monthsContainer = document.querySelector( ".months" );
  monthsContainer.innerHTML = "";

  monthsData.forEach( ( m, index ) => {
    const income = m.income ?? 0;
    const expenses = m.expenses ?? 0;
    const savings = m.savings ?? ( income - expenses );
    const transactions = m.transactions ?? 0;

    /* ---------------- PERCENTAGE LOGIC ---------------- */
    let percent = "+0%";
    let percentClass = "positive";

    if ( income === 0 && expenses > 0 )
    {
      percent = "-100%";
      percentClass = "negative";

    } else if ( income > 0 && expenses === 0 )
    {
      percent = "+100%";
      percentClass = "positive";

    } else if ( income > 0 )
    {
      let calc = ( ( savings / income ) * 100 ).toFixed( 0 );
      if ( calc > 100 ) calc = 100;

      percent = ( calc >= 0 ? "+" : "" ) + calc + "%";
      percentClass = calc >= 0 ? "positive" : "negative";
    }

    /* ---------------- TEMPLATE ---------------- */
    const monthCard = `
      <a class="card-link" href="day.html?month=${ index }">
        <div class="month-card">

          <div class="month-header">
            <div class="month-title">
              <i class="bi bi-calendar-event"></i>
              <span>${ m.month }</span>
            </div>

            <div class="percentage-badge ${ percentClass }">
              ↗ ${ percent }
            </div>
          </div>

          <div class="stats-row">
            <div class="stat-box income-box">
              <span class="label">Income</span>
              <span class="value green">$${ income }</span>
            </div>

            <div class="stat-box expenses-box">
              <span class="label">Expenses</span>
              <span class="value red">$${ expenses }</span>
            </div>

            <div class="stat-box savings-box">
              <span class="label">Savings</span>
              <span class="value blue">$${ savings }</span>
            </div>
          </div>

          <hr />

          <div class="details-row">
            <span>Net Savings:</span>
            <span class="value ${ savings < 0 ? "red" : "green" }">
              $${ savings }
            </span>
          </div>

          <div class="details-row">
            <span>Transactions:</span>
            <span class="value">${ transactions }</span>
          </div>

        </div>
      </a>
    `;

    monthsContainer.innerHTML += monthCard;
  } );

  fixAnchorColors(); // <<< IMPORTANT FIX
}

/* ------------------------------------------------------------- */
/* ----------- FIX: REMOVE BLUE/PURPLE LINK COLOR -------------- */
/* ------------------------------------------------------------- */

function fixAnchorColors () {
  const style = document.createElement( "style" );
  style.innerHTML = `
    .card-link,
    .card-link:link,
    .card-link:visited,
    .card-link:hover,
    .card-link:active,
    .card-link:focus {
      color: inherit !important;
      text-decoration: none !important;
    }
  `;
  document.head.appendChild( style );
}

/* ------------------------------------------------------------- */
/* ------------------ SUMMARY CARDS ---------------------------- */
/* ------------------------------------------------------------- */

function updateSummaryCards () {
  const totalIncome = monthsData.reduce( ( sum, m ) => sum + ( m.income ?? 0 ), 0 );
  const totalExpenses = monthsData.reduce( ( sum, m ) => sum + ( m.expenses ?? 0 ), 0 );

  const totalSavings = totalIncome - totalExpenses;

  document.getElementById( "totalIncome" ).textContent = "$" + totalIncome;
  document.getElementById( "totalExpenses" ).textContent = "$" + totalExpenses;
  document.getElementById( "totalSavings" ).textContent = "$" + totalSavings;
}

/* ------------------------------------------------------------- */
/* ------------------------- INIT ------------------------------ */
/* ------------------------------------------------------------- */

window.onload = () => {
  loadMonthCards();
  updateSummaryCards();
};
