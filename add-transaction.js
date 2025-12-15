( function () {
  const TX_KEY = "bt_transactions";
  const CAT_KEY = "bt_categories";

  const form = document.querySelector( ".form-container" );
  const typeSelect = document.getElementById( "type" );
  const categorySelect = document.getElementById( "category" );
  const addCategoryBtn = document.querySelector( ".category button" );

  /* ---------- Storage ---------- */
  const load = ( k, d ) => JSON.parse( localStorage.getItem( k ) ) || d;
  const save = ( k, d ) => localStorage.setItem( k, JSON.stringify( d ) );

  /* ---------- Init Categories ---------- */
  if ( !localStorage.getItem( CAT_KEY ) )
  {
    save( CAT_KEY, {
      income: [ "Salary", "Freelance" ],
      expense: [ "Grocery", "Utility" ],
      savings: [ "Emergency Fund" ]
    } );
  }

  categorySelect.disabled = true;

  /* ---------- Render Categories ---------- */
  function renderCategories ( type ) {
    const cats = load( CAT_KEY, {} );
    categorySelect.innerHTML = "";

    cats[ type ].forEach( c => {
      categorySelect.appendChild( new Option( c, c ) );
    } );

    categorySelect.appendChild( new Option( "────────────", "" ) );
    categorySelect.appendChild( new Option( "✏️ Edit selected category", "__edit" ) );
    categorySelect.appendChild( new Option( "🗑️ Delete selected category", "__delete" ) );

    categorySelect.disabled = false;
  }

  /* ---------- Transaction Type Change ---------- */
  typeSelect.addEventListener( "change", () => {
    if ( typeSelect.value === "select" )
    {
      categorySelect.disabled = true;
      categorySelect.innerHTML = `<option>Select Transaction Type first</option>`;
      return;
    }
    renderCategories( typeSelect.value );
  } );

  /* ---------- Category Dropdown Actions ---------- */
  categorySelect.addEventListener( "change", () => {
    const action = categorySelect.value;
    const type = typeSelect.value;
    const cats = load( CAT_KEY, {} );

    // Save last selected real category
    if ( !action.startsWith( "__" ) )
    {
      categorySelect.lastCategory = action;
      return;
    }

    // EDIT
    if ( action === "__edit" )
    {
      const current = categorySelect.lastCategory;
      if ( !current ) return;

      const updated = prompt( "Edit category name:", current );
      if ( !updated ) return;

      const idx = cats[ type ].indexOf( current );
      if ( idx > -1 )
      {
        cats[ type ][ idx ] = updated.trim();
        save( CAT_KEY, cats );
        renderCategories( type );
        categorySelect.value = updated.trim();
      }
    }

    // DELETE
    if ( action === "__delete" )
    {
      const current = categorySelect.lastCategory;
      if ( !current ) return;

      cats[ type ] = cats[ type ].filter( c => c !== current );
      save( CAT_KEY, cats );
      renderCategories( type );
    }
  } );

  /* ---------- Add Category Button ---------- */
  addCategoryBtn.addEventListener( "click", e => {
    e.preventDefault();

    const type = typeSelect.value;
    if ( type === "select" )
    {
      alert( "Select transaction type first" );
      return;
    }

    const name = prompt( "Enter new category name:" );
    if ( !name ) return;

    const cats = load( CAT_KEY, {} );
    if ( !cats[ type ].includes( name.trim() ) )
    {
      cats[ type ].push( name.trim() );
      save( CAT_KEY, cats );
      renderCategories( type );
      categorySelect.value = name.trim();
    }
  } );

  /* ---------- Submit Transaction ---------- */
  form.addEventListener( "submit", e => {
    e.preventDefault();

    const tx = {
      id: Date.now(),
      item: item.value.trim(),
      type: type.value,
      category: category.value,
      date: date.value,
      amount: Number( amount.value )
    };

    if ( !tx.item || tx.type === "select" || !tx.category || !tx.date || !tx.amount )
    {
      alert( "Fill all fields" );
      return;
    }

    const data = load( TX_KEY, [] );
    data.push( tx );
    save( TX_KEY, data );

    const d = new Date( tx.date );
    window.location.href =
      `day.html?year=${ d.getFullYear() }&month=${ d.getMonth() + 1 }&day=${ d.getDate() }`;
  } );
} )();
