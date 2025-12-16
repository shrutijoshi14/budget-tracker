( function () {

  const TX_KEY = "bt_transactions";
  const CAT_KEY = "bt_categories";

  const form = document.querySelector( ".form-container" );
  const item = document.getElementById( "item" );
  const type = document.getElementById( "type" );
  const category = document.getElementById( "category" );
  const date = document.getElementById( "date" );
  const amount = document.getElementById( "amount" );
  const addCategoryBtn = document.querySelector( ".category button" );

  const load = ( k, d ) => JSON.parse( localStorage.getItem( k ) ) || d;
  const save = ( k, d ) => localStorage.setItem( k, JSON.stringify( d ) );

  const params = new URLSearchParams( location.search );
  const editId = params.get( "edit" );

  let transactions = load( TX_KEY, [] );

  /* ---------- INIT CATEGORIES ---------- */
  if ( !localStorage.getItem( CAT_KEY ) )
  {
    save( CAT_KEY, {
      income: [ "Salary", "Freelance" ],
      expense: [ "Grocery", "Utility" ],
      savings: [ "Emergency Fund" ]
    } );
  }

  category.disabled = true;

  function renderCategories ( typeVal ) {
    const cats = load( CAT_KEY, {} );
    category.innerHTML = "";

    cats[ typeVal ].forEach( c => {
      category.appendChild( new Option( c, c ) );
    } );

    category.appendChild( new Option( "────────────", "" ) );
    category.appendChild( new Option( "✏️ Edit selected category", "__edit" ) );
    category.appendChild( new Option( "🗑️ Delete selected category", "__delete" ) );

    category.disabled = false;
  }

  /* ---------- TYPE CHANGE ---------- */
  type.addEventListener( "change", () => {
    if ( type.value === "select" )
    {
      category.disabled = true;
      category.innerHTML = `<option>Select Transaction Type first</option>`;
      return;
    }
    renderCategories( type.value );
  } );

  /* ---------- CATEGORY ACTION ---------- */
  category.addEventListener( "change", () => {
    const action = category.value;
    const cats = load( CAT_KEY, {} );
    const typeVal = type.value;

    if ( !action.startsWith( "__" ) )
    {
      category.last = action;
      return;
    }

    if ( action === "__edit" )
    {
      if ( !category.last ) return;
      const updated = prompt( "Edit category:", category.last );
      if ( !updated ) return;

      const i = cats[ typeVal ].indexOf( category.last );
      cats[ typeVal ][ i ] = updated.trim();
      save( CAT_KEY, cats );
      renderCategories( typeVal );
      category.value = updated.trim();
    }

    if ( action === "__delete" )
    {
      if ( !category.last ) return;
      cats[ typeVal ] = cats[ typeVal ].filter( c => c !== category.last );
      save( CAT_KEY, cats );
      renderCategories( typeVal );
    }
  } );

  /* ---------- ADD CATEGORY ---------- */
  addCategoryBtn.addEventListener( "click", e => {
    e.preventDefault();
    if ( type.value === "select" )
    {
      alert( "Select transaction type first" );
      return;
    }

    const name = prompt( "New category name:" );
    if ( !name ) return;

    const cats = load( CAT_KEY, {} );
    cats[ type.value ].push( name.trim() );
    save( CAT_KEY, cats );

    renderCategories( type.value );
    category.value = name.trim();
  } );

  /* ---------- EDIT MODE PREFILL ---------- */
  if ( editId )
  {
    const tx = transactions.find( t => String( t.id ) === editId );
    if ( tx )
    {
      document.querySelector( "h1" ).textContent = "Edit Transaction";
      document.querySelector( ".submit-btn" ).textContent = "Update Transaction";

      item.value = tx.description || tx.item;
      type.value = tx.transactionType || tx.type;
      renderCategories( type.value );
      category.value = tx.categoryName || tx.category;
      date.value = tx.transactionDate || tx.date;
      amount.value = tx.amount;
    }
  }

  /* ---------- SUBMIT ---------- */
  form.addEventListener( "submit", e => {
    e.preventDefault();

    const tx = {
      id: editId ? Number( editId ) : Date.now(),

      /* dashboard compatible */
      description: item.value.trim(),
      transactionType: type.value,
      categoryName: category.value,
      transactionDate: date.value,

      /* backward compatibility */
      item: item.value.trim(),
      type: type.value,
      category: category.value,
      date: date.value,

      amount: Number( amount.value )
    };

    if ( !tx.description || tx.type === "select" || !tx.category || !tx.date || !tx.amount )
    {
      alert( "Fill all fields" );
      return;
    }

    if ( editId )
    {
      const index = transactions.findIndex( t => String( t.id ) === editId );
      transactions[ index ] = tx;
    } else
    {
      transactions.push( tx );
    }

    save( TX_KEY, transactions );

    const d = new Date( tx.date );
    location.href = `day.html?year=${ d.getFullYear() }&month=${ d.getMonth() + 1 }&day=${ d.getDate() }`;
  } );

} )();
