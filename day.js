const KEY = "bt_transactions";

/* ========================= */
const params = new URLSearchParams( location.search );
let month = params.has( "month" ) ? +params.get( "month" ) : new Date().getMonth();
let year = params.has( "year" ) ? +params.get( "year" ) : new Date().getFullYear();
let selectedDate = null;

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/* ========================= */
function loadTransactions () {
  return JSON.parse( localStorage.getItem( KEY ) ) || [];
}

function saveTransactions ( transactions ) {
  localStorage.setItem( KEY, JSON.stringify( transactions ) );
}

function normalizeTransaction ( t ) {
  return {
    id: t.id,
    description: t.description || "Untitled",
    type: t.type || "",
    category: t.category || "",
    date: t.date || "",
    amount: Number( t.amount || 0 )
  };
}


function getAll () {
  return loadTransactions().map( normalizeTransaction );
}

function filtered () {
  return getAll().filter( t => {
    const d = new Date( t.date );
    if ( selectedDate !== null )
    {
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === selectedDate;
    }
    return d.getFullYear() === year && d.getMonth() === month;
  } );
}

/* ========================= */
function renderTransactions () {
  const container = document.getElementById( "transactionsList" );
  const tx = filtered();

  document.getElementById( "countBadge" ).textContent = tx.length;

  if ( !tx.length )
  {
    container.innerHTML = `<p style="padding:20px; text-align:center; color:#64748b;">No transactions found</p>`;
    return;
  }

  container.innerHTML = tx.map( t => `
    <div class="transaction-item">
      <div class="icon-circle">
        <i class="bi bi-tag"></i>
      </div>

      <div class="transaction-info">
        <h3>${ t.description }</h3>
        <div class="meta">
          <span class="tag">${ t.category }</span>
          <span>${ new Date( t.date ).toLocaleDateString() }</span>
          <span class="type">${ t.type }</span>
        </div>
      </div>

      <div class="transaction-right">
        <span class="amount ${ t.type === "expense" ? "negative" : "green" }">
          ${ t.type === "expense" ? "-" : "+" }$${ t.amount.toFixed( 2 ) }
        </span>
        <i class="bi bi-pencil" onclick="editTx(${ t.id })" style="cursor:pointer; font-size:18px;"></i>
        <i class="bi bi-trash" onclick="deleteTx(${ t.id })" style="cursor:pointer; font-size:18px; color:#dc2626;"></i>
      </div>
    </div>
  `).join( '' );
}

/* ========================= */
function deleteTx ( id ) {
  if ( !confirm( "Delete this transaction?" ) ) return;

  const transactions = loadTransactions();
  const index = transactions.findIndex( t => t.id === id );

  if ( index !== -1 )
  {
    transactions.splice( index, 1 );
    saveTransactions( transactions );
    renderAll();
  }
}

function editTx ( id ) {
  location.href = `add-transaction-form.html?edit=${ id }`;
}

/* ========================= */
function updateCards () {
  let i = 0, e = 0, s = 0;
  filtered().forEach( t => {
    if ( t.type === "income" ) i += t.amount;
    if ( t.type === "expense" ) e += t.amount;
    if ( t.type === "savings" ) s += t.amount;
  } );

  document.getElementById( "totalIncome" ).textContent = `$${ i.toFixed( 2 ) }`;
  document.getElementById( "totalExpenses" ).textContent = `$${ e.toFixed( 2 ) }`;
  document.getElementById( "totalSavings" ).textContent = `$${ s.toFixed( 2 ) }`;
  document.getElementById( "netBalance" ).textContent = `$${ ( i - e + s ).toFixed( 2 ) }`;
}

/* ========================= */
function updateSummary () {
  const tx = filtered();
  const incomeCount = tx.filter( t => t.type === "income" ).length;
  const expenseCount = tx.filter( t => t.type === "expense" ).length;
  const savingsCount = tx.filter( t => t.type === "savings" ).length;

  const expenseTotal = tx.filter( t => t.type === "expense" ).reduce( ( sum, t ) => sum + t.amount, 0 );
  const avgExpense = expenseCount > 0 ? expenseTotal / expenseCount : 0;

  document.getElementById( "summaryList" ).innerHTML = `
    <div class="summary-row">
      <span>Total Transactions:</span>
      <span class="black">${ tx.length }</span>
    </div>
    <div class="summary-row">
      <span>Income Transactions:</span>
      <span class="green">${ incomeCount }</span>
    </div>
    <div class="summary-row">
      <span>Expense Transactions:</span>
      <span class="red">${ expenseCount }</span>
    </div>
    <div class="summary-row">
      <span>Savings Transactions:</span>
      <span class="blue">${ savingsCount }</span>
    </div>
  `;

  document.getElementById( "averageExpense" ).innerHTML = `
    <span>Average Expense:</span>
    <span class="black">$${ avgExpense.toFixed( 2 ) }</span>
  `;
}

/* ========================= */
function updateCategory () {
  const box = document.getElementById( "categoryBreakdown" );
  box.innerHTML = `<h2>Category Breakdown</h2>`;

  const map = {};
  const typeMap = {};

  filtered().forEach( t => {
    map[ t.category ] = ( map[ t.category ] || 0 ) + t.amount;
    typeMap[ t.category ] = t.type;
  } );

  if ( Object.keys( map ).length === 0 )
  {
    box.innerHTML += `<p style="padding:20px; text-align:center; color:#64748b;">No categories to display</p>`;
    return;
  }

  Object.entries( map ).forEach( ( [ c, a ] ) => {
    const txType = typeMap[ c ];
    box.innerHTML += `
      <div class="category-row">
        <span class="category-pill">${ c }</span>
        <div class="category-right">
          <span class="amount">$${ a.toFixed( 2 ) }</span>
          <span class="type">(${ txType })</span>
        </div>
      </div>`;
  } );
}

/* ========================= */
function renderCalendar () {
  const grid = document.getElementById( "calendarGrid" );

  // Keep day names
  const dayNames = grid.querySelectorAll( '.day-name' );
  grid.innerHTML = '';
  dayNames.forEach( day => grid.appendChild( day ) );

  const firstDay = new Date( year, month, 1 ).getDay();
  const daysInMonth = new Date( year, month + 1, 0 ).getDate();
  const prevMonthDays = new Date( year, month, 0 ).getDate();

  // Get all transaction dates for this month
  const transactionDates = getAll()
    .filter( t => {
      const d = new Date( t.date );
      return d.getFullYear() === year && d.getMonth() === month;
    } )
    .map( t => new Date( t.date ).getDate() );

  // Previous month days
  for ( let i = firstDay - 1; i >= 0; i-- )
  {
    const day = document.createElement( 'div' );
    day.className = 'muted';
    day.textContent = prevMonthDays - i;
    grid.appendChild( day );
  }

  // Current month days
  for ( let i = 1; i <= daysInMonth; i++ )
  {
    const day = document.createElement( 'div' );
    day.textContent = i;
    day.style.cursor = 'pointer';

    if ( transactionDates.includes( i ) )
    {
      day.style.background = '#2563eb';
      day.style.color = '#fff';
      day.style.borderRadius = '8px';
      day.style.fontWeight = '600';
    }

    if ( selectedDate === i )
    {
      day.style.outline = '2px solid #2563eb';
      day.style.outlineOffset = '2px';
    }

    day.onclick = () => {
      selectedDate = selectedDate === i ? null : i;
      renderAll();
    };

    grid.appendChild( day );
  }

  // Next month days
  const totalCells = grid.children.length - 7; // excluding day names
  const remainingCells = ( 7 - ( totalCells % 7 ) ) % 7;
  for ( let i = 1; i <= remainingCells; i++ )
  {
    const day = document.createElement( 'div' );
    day.className = 'muted';
    day.textContent = i;
    grid.appendChild( day );
  }
}

/* ========================= */
function updateHeader () {
  document.getElementById( "monthYear" ).textContent = `${ monthNames[ month ] } ${ year }`;
  document.getElementById( "pageTitle" ).textContent = `${ monthNames[ month ] } ${ year }`;
}

/* ========================= */
function changeMonth ( delta ) {
  month += delta;
  if ( month > 11 )
  {
    month = 0;
    year++;
  } else if ( month < 0 )
  {
    month = 11;
    year--;
  }
  selectedDate = null;

  // Update URL
  const newUrl = `${ window.location.pathname }?year=${ year }&month=${ month }`;
  window.history.pushState( {}, '', newUrl );

  renderAll();
}

/* ========================= */
function renderAll () {
  updateHeader();
  renderCalendar();
  renderTransactions();
  updateCards();
  updateSummary();
  updateCategory();
}

/* ========================= */
document.getElementById( "prevMonth" ).onclick = () => changeMonth( -1 );
document.getElementById( "nextMonth" ).onclick = () => changeMonth( 1 );

renderAll();
