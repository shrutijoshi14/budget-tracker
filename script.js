// -------- Monthly Savings Chart (3 datasets) --------
// const monthlyCtx = document.getElementById( 'monthlyChart' );

// new Chart( monthlyCtx, {
//   type: 'bar',
//   data: {
//     labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
//     datasets: [
//       {
//         label: 'Income',
//         data: [ 45000, 48000, 47000, 50000, 52000, 51000, 53000, 54000, 55000, 56000, 57000, 58000 ],
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         borderColor: 'rgb(75, 192, 192)',
//         borderWidth: 2
//       },
//       {
//         label: 'Expenses',
//         data: [ 25000, 26000, 24000, 25500, 26000, 27000, 28000, 30000, 31000, 32000, 33000, 34000 ],
//         backgroundColor: 'rgba(255, 99, 132, 0.2)',
//         borderColor: 'rgb(255, 99, 132)',
//         borderWidth: 2
//       },
//       {
//         label: 'Net Savings',
//         data: [ 20000, 22000, 23000, 24500, 26000, 24000, 25000, 24000, 24000, 24000, 24000, 24000 ],
//         backgroundColor: 'rgba(54, 162, 235, 0.2)',
//         borderColor: 'rgb(54, 162, 235)',
//         borderWidth: 2
//       }
//     ]
//   },
//   options: {
//     scales: {
//       y: { beginAtZero: true }
//     },
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         enabled: false,
//         mode: 'index',
//         intersect: false,
//         external: function ( context ) {

//           const tooltipModel = context.tooltip;
//           const tooltipEl = document.getElementById( "customTooltip" );

//           // Hide tooltip
//           if ( tooltipModel.opacity === 0 )
//           {
//             tooltipEl.style.display = "none";
//             return;
//           }

//           // Get values
//           const month = tooltipModel.title[ 0 ];
//           const income = tooltipModel.dataPoints[ 0 ].raw;
//           const expenses = tooltipModel.dataPoints[ 1 ].raw;
//           const savings = tooltipModel.dataPoints[ 2 ].raw;

//           // Set HTML
//           tooltipEl.innerHTML = `
//       <div class="month">${ month }</div>
//       <div class="income">Income : ${ income }</div>
//       <div class="expenses">Expenses : ${ expenses }</div>
//       <div class="savings">Net Savings : ${ savings }</div>
//     `;

//           // Position
//           const position = context.chart.canvas.getBoundingClientRect();
//           tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 20 + "px";
//           tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - 20 + "px";

//           tooltipEl.style.display = "block";
//         }
//       }
//     }
//   }
// } );

// // -------- Expense Pie Chart --------
// const pieCtx = document.getElementById( 'expensePie' );

// new Chart( pieCtx, {
//   type: 'pie',
//   data: {
//     labels: [ 'Food', 'Bills', 'Transport', 'Shopping', 'Entertainment', 'Other' ],
//     datasets: [ {
//       data: [ 5000, 2500, 1200, 3000, 1800, 900 ],
//       backgroundColor: [
//         'rgba(255, 99, 132, 0.6)',
//         'rgba(255, 159, 64, 0.6)',
//         'rgba(255, 205, 86, 0.6)',
//         'rgba(75, 192, 192, 0.6)',
//         'rgba(54, 162, 235, 0.6)',
//         'rgba(153, 102, 255, 0.6)'
//       ],
//       borderColor: [
//         'rgb(255, 99, 132)',
//         'rgb(255, 159, 64)',
//         'rgb(255, 205, 86)',
//         'rgb(75, 192, 192)',
//         'rgb(54, 162, 235)',
//         'rgb(153, 102, 255)'
//       ],
//       borderWidth: 2,
//     } ]
//   },
//   options: {
//     responsive: true,
//     plugins: {
//       legend: { position: 'bottom' },
//       tooltip: { enabled: true }
//     }
//   }
// } );

/* ===============================
   GLOBAL STORAGE KEYS
================================ */
const KEY = 'bt_transactions';
const YEAR_KEY = 'bt_currentYear';

/* ===============================
   STORAGE HELPERS
================================ */
function loadTransactions () {
  return JSON.parse( localStorage.getItem( KEY ) || '[]' );
}

function getByYear ( year ) {
  return loadTransactions().filter( ( t ) => new Date( t.date ).getFullYear() === Number( year ) );
}

function getByMonth ( year, month ) {
  return loadTransactions().filter( ( t ) => {
    const d = new Date( t.date );
    return d.getFullYear() === Number( year ) && d.getMonth() + 1 === Number( month );
  } );
}

function sum ( list, type ) {
  return list.filter( ( t ) => t.type === type ).reduce( ( s, t ) => s + Number( t.amount ), 0 );
}

/* ===============================
   CURRENT YEAR HANDLING
================================ */
function currentYear () {
  return Number( localStorage.getItem( YEAR_KEY ) ) || new Date().getFullYear();
}

function setYear ( year ) {
  localStorage.setItem( YEAR_KEY, year );
  render();
}

/* ===============================
   CHART INITIALIZATION (UI SAME)
================================ */
const monthlyCtx = document.getElementById( 'monthlyChart' );
const pieCtx = document.getElementById( 'expensePie' );

let monthlyChart = new Chart( monthlyCtx, {
  type: 'bar',
  data: {
    labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
    datasets: [
      {
        label: 'Income',
        data: [],
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgb(75,192,192)',
        borderWidth: 2,
      },
      {
        label: 'Expenses',
        data: [],
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgb(255,99,132)',
        borderWidth: 2,
      },
      {
        label: 'Net Savings',
        data: [],
        backgroundColor: 'rgba(54,162,235,0.2)',
        borderColor: 'rgb(54,162,235)',
        borderWidth: 2,
      },
    ],
  },
  options: {
    scales: { y: { beginAtZero: true } },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
        mode: 'index',
        intersect: false,
        external: function ( context ) {
          const tooltipModel = context.tooltip;
          const tooltipEl = document.getElementById( 'customTooltip' );

          if ( tooltipModel.opacity === 0 )
          {
            tooltipEl.style.display = 'none';
            return;
          }

          const month = tooltipModel.title[ 0 ];
          const income = tooltipModel.dataPoints[ 0 ].raw;
          const expenses = tooltipModel.dataPoints[ 1 ].raw;
          const savings = tooltipModel.dataPoints[ 2 ].raw;

          tooltipEl.innerHTML = `
            <div class="month">${ month }</div>
            <div class="income">Income : ${ income }</div>
            <div class="expenses">Expenses : ${ expenses }</div>
            <div class="savings">Net Savings : ${ savings }</div>
          `;

          const position = context.chart.canvas.getBoundingClientRect();
          tooltipEl.style.left =
            position.left + window.pageXOffset + tooltipModel.caretX + 20 + 'px';
          tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - 20 + 'px';
          tooltipEl.style.display = 'block';
        },
      },
    },
  },
} );

let pieChart = new Chart( pieCtx, {
  type: 'pie',
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          'rgba(255,99,132,0.6)',
          'rgba(255,159,64,0.6)',
          'rgba(255,205,86,0.6)',
          'rgba(75,192,192,0.6)',
          'rgba(54,162,235,0.6)',
          'rgba(153,102,255,0.6)',
        ],
        borderWidth: 2,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  },
} );

/* ===============================
   CHART DATA UPDATES
================================ */
function updateMonthlyChart ( year ) {
  const incomeArr = [];
  const expenseArr = [];
  const savingsArr = [];

  for ( let m = 1; m <= 12; m++ )
  {
    const data = getByMonth( year, m );
    const income = sum( data, 'income' );
    const expense = sum( data, 'expense' );
    incomeArr.push( income );
    expenseArr.push( expense );
    savingsArr.push( income - expense );
  }

  monthlyChart.data.datasets[ 0 ].data = incomeArr;
  monthlyChart.data.datasets[ 1 ].data = expenseArr;
  monthlyChart.data.datasets[ 2 ].data = savingsArr;
  monthlyChart.update();
}

function updatePieChart ( year ) {
  const data = getByYear( year ).filter( ( t ) => t.type === 'expense' );
  const categories = {};

  data.forEach( ( t ) => {
    categories[ t.category ] = ( categories[ t.category ] || 0 ) + Number( t.amount );
  } );

  pieChart.data.labels = Object.keys( categories );
  pieChart.data.datasets[ 0 ].data = Object.values( categories );
  pieChart.update();
}

/* ===============================
   MAIN RENDER FUNCTION
================================ */
function render () {
  const year = currentYear();
  document.getElementById( 'currentYear' ).textContent = year;

  const data = getByYear( year );
  const income = sum( data, 'income' );
  const expense = sum( data, 'expense' );
  const savings = sum( data, 'savings' );
  const net = income - expense + savings;

  document.getElementById( 'totalIncome' ).textContent = `$${ income.toFixed( 2 ) }`;
  document.getElementById( 'totalExpenses' ).textContent = `$${ expense.toFixed( 2 ) }`;
  document.getElementById( 'totalSavings' ).textContent = `$${ savings.toFixed( 2 ) }`;
  document.getElementById( 'netBalance' ).textContent = `$${ net.toFixed( 2 ) }`;

  const monthsBox = document.querySelector( '.months' );
  monthsBox.innerHTML = '';

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  for ( let m = 1; m <= 12; m++ )
  {
    const mData = getByMonth( year, m );
    const inc = sum( mData, 'income' );
    const exp = sum( mData, 'expense' );
    const sav = sum( mData, 'savings' );
    const netM = inc - exp + sav;

    const card = document.createElement( 'div' );
    card.className = 'month-card';
    card.innerHTML = `
      <div class="month-header">
        <div class="month-title">
          <i class="bi bi-calendar-event"></i>
          <span>${ monthNames[ m - 1 ] }</span>
        </div>
      </div>
      <div class="stats-row">
        <div class="stat-box income-box"><span class="label">Income</span><span class="value green">$${ inc.toFixed(
      2
    ) }</span></div>
        <div class="stat-box expenses-box"><span class="label">Expenses</span><span class="value red">$${ exp.toFixed(
      2
    ) }</span></div>
        <div class="stat-box savings-box"><span class="label">Savings</span><span class="value blue">$${ sav.toFixed(
      2
    ) }</span></div>
      </div>
      <hr />
      <div class="details-row"><span>Net Savings:</span><span class="value ${ netM < 0 ? 'red' : 'green'
      }">$${ netM.toFixed( 2 ) }</span></div>
      <div class="details-row"><span>Transactions:</span><span class="value">${ mData.length
      }</span></div>
    `;

    card.onclick = () => {
      window.location.href = `day.html?year=${ year }&month=${ m }`;
    };

    monthsBox.appendChild( card );
  }

  updateMonthlyChart( year );
  updatePieChart( year );
}

/* ===============================
   EVENTS
================================ */
document.getElementById( 'prevYear' ).onclick = () => setYear( currentYear() - 1 );
document.getElementById( 'nextYear' ).onclick = () => setYear( currentYear() + 1 );

document.addEventListener( 'DOMContentLoaded', render );
