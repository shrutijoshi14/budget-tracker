// -------- Monthly Savings Chart (3 datasets) --------
const monthlyCtx = document.getElementById( 'monthlyChart' );

new Chart( monthlyCtx, {
  type: 'bar',
  data: {
    labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
    datasets: [
      {
        label: 'Income',
        data: [ 45000, 48000, 47000, 50000, 52000, 51000, 53000, 54000, 55000, 56000, 57000, 58000 ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 2
      },
      {
        label: 'Expenses',
        data: [ 25000, 26000, 24000, 25500, 26000, 27000, 28000, 30000, 31000, 32000, 33000, 34000 ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 2
      },
      {
        label: 'Net Savings',
        data: [ 20000, 22000, 23000, 24500, 26000, 24000, 25000, 24000, 24000, 24000, 24000, 24000 ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 2
      }
    ]
  },
  options: {
    scales: {
      y: { beginAtZero: true }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
        mode: 'index',
        intersect: false,
        external: function ( context ) {

          const tooltipModel = context.tooltip;
          const tooltipEl = document.getElementById( "customTooltip" );

          // Hide tooltip
          if ( tooltipModel.opacity === 0 )
          {
            tooltipEl.style.display = "none";
            return;
          }

          // Get values
          const month = tooltipModel.title[ 0 ];
          const income = tooltipModel.dataPoints[ 0 ].raw;
          const expenses = tooltipModel.dataPoints[ 1 ].raw;
          const savings = tooltipModel.dataPoints[ 2 ].raw;

          // Set HTML
          tooltipEl.innerHTML = `
      <div class="month">${ month }</div>
      <div class="income">Income : ${ income }</div>
      <div class="expenses">Expenses : ${ expenses }</div>
      <div class="savings">Net Savings : ${ savings }</div>
    `;

          // Position
          const position = context.chart.canvas.getBoundingClientRect();
          tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 20 + "px";
          tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - 20 + "px";

          tooltipEl.style.display = "block";
        }
      }
    }
  }
} );


// -------- Expense Pie Chart --------
const pieCtx = document.getElementById( 'expensePie' );

new Chart( pieCtx, {
  type: 'pie',
  data: {
    labels: [ 'Food', 'Bills', 'Transport', 'Shopping', 'Entertainment', 'Other' ],
    datasets: [ {
      data: [ 5000, 2500, 1200, 3000, 1800, 900 ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(255, 205, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)'
      ],
      borderWidth: 2,
    } ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { enabled: true }
    }
  }
} );







