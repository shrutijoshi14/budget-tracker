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

document.querySelector( ".month-year" ).textContent = `${ monthNames[ month ] } ${ year }`;
document.querySelector( "header h1" ).textContent = `${ monthNames[ month ] } ${ year }`;

/* ========================= */
function getRaw () {
  return JSON.parse( localStorage.getItem( KEY ) ) || [];
}

function normalize ( t, index ) {
  return {
    id: index,
    title: t.title || t.name || t.description || "Untitled",
    amount: Number( t.amount || 0 ),
    type: t.type || t.transactionType,
    category: t.category || t.categoryName,
    date: t.date || t.transactionDate
  };
}

function getAll () {
  return getRaw().map( normalize );
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
  const card = document.querySelector( ".transactions-card" );
  const header = card.querySelector( ".card-header" );
  const tx = filtered();

  card.innerHTML = "";
  card.appendChild( header );
  document.querySelector( ".count-badge" ).textContent = tx.length;

  if ( !tx.length )
  {
    card.innerHTML += `<p style="padding:20px">No transactions</p>`;
    return;
  }

  tx.forEach( t => {
    card.innerHTML += `
      <div class="transaction-item">
        <div class="icon-circle"><i class="bi bi-tag"></i></div>

        <div class="transaction-info">
          <h3>${ t.title }</h3>
          <div class="meta">
            <span class="tag">${ t.category }</span>
            <span>${ new Date( t.date ).toDateString() }</span>
            <span class="type">${ t.type }</span>
          </div>
        </div>

        <div class="transaction-right">
          <span class="amount ${ t.type === "expense" ? "negative" : "green" }">
            ${ t.type === "expense" ? "-" : "+" }$${ t.amount }
          </span>
          <i class="bi bi-pencil" onclick="editTx(${ t.id })"></i>
          <i class="bi bi-trash" onclick="deleteTx(${ t.id })"></i>
        </div>
      </div>`;
  } );
}

/* ========================= */
function deleteTx ( id ) {
  if ( !confirm( "Delete this transaction?" ) ) return;
  const raw = getRaw();
  raw.splice( id, 1 );
  localStorage.setItem( KEY, JSON.stringify( raw ) );
  renderAll();
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

  totalIncome.textContent = `$${ i.toFixed( 2 ) }`;
  totalExpenses.textContent = `$${ e.toFixed( 2 ) }`;
  totalSavings.textContent = `$${ s.toFixed( 2 ) }`;
  netBalance.textContent = `$${ ( i - e + s ).toFixed( 2 ) }`;
}

/* ========================= */
function updateSummary () {
  const tx = filtered();
  document.querySelector( ".summary-list" ).innerHTML = `
    <div class="summary-row"><span>Total Transactions:</span><span class="black">${ tx.length }</span></div>
    <div class="summary-row"><span>Income Transactions:</span><span class="green">${ tx.filter( t => t.type === "income" ).length }</span></div>
    <div class="summary-row"><span>Expense Transactions:</span><span class="red">${ tx.filter( t => t.type === "expense" ).length }</span></div>
    <div class="summary-row"><span>Savings Transactions:</span><span class="blue">${ tx.filter( t => t.type === "savings" ).length }</span></div>
  `;
}

/* ========================= */
function updateCategory () {
  const box = document.querySelector( ".summary-card:last-child" );
  box.innerHTML = `<h2>Category Breakdown</h2>`;
  const map = {};
  filtered().forEach( t => map[ t.category ] = ( map[ t.category ] || 0 ) + t.amount );
  Object.entries( map ).forEach( ( [ c, a ] ) => {
    box.innerHTML += `
      <div class="category-row">
        <span class="category-pill">${ c }</span>
        <div class="category-right"><span class="amount">$${ a.toFixed( 2 ) }</span></div>
      </div>`;
  } );
}

/* ========================= */
function setupCalendar () {
  const days = document.querySelectorAll( ".calendar-grid div" );
  const dates = getAll()
    .filter( t => new Date( t.date ).getMonth() === month && new Date( t.date ).getFullYear() === year )
    .map( t => new Date( t.date ).getDate() );

  days.forEach( d => {
    const day = +d.textContent;
    if ( isNaN( day ) ) return;
    d.style.cursor = "pointer";

    if ( dates.includes( day ) )
    {
      d.style.background = "#2563eb";
      d.style.color = "#fff";
      d.style.borderRadius = "8px";
    }

    d.onclick = () => {
      selectedDate = day;
      days.forEach( x => x.style.outline = "" );
      d.style.outline = "2px solid #2563eb";
      renderAll();
    };
  } );
}

/* ========================= */
function renderAll () {
  renderTransactions();
  updateCards();
  updateSummary();
  updateCategory();
}

setupCalendar();
renderAll();
