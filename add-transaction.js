(function () {
  const form = document.querySelector('.form-container');
  const item = document.getElementById('item');
  const type = document.getElementById('type');
  const category = document.getElementById('category');
  const date = document.getElementById('date');
  const amount = document.getElementById('amount');
  const addCategoryBtn = document.querySelector('.category button');

  const params = new URLSearchParams(location.search);
  const editId = params.get('edit');

  let transactions = loadTransactions();

  // Ensure categories exist in storage if not already
  if (!localStorage.getItem(DATA_CAT_KEY)) {
    saveCategories(loadCategories());
  }

  category.disabled = true;

  // Render the category dropdown options based on selected type
  function renderCategories(typeVal) {
    const cats = loadCategories();
    category.innerHTML = '';

    if (cats[typeVal]) {
      cats[typeVal].forEach((c) => {
        category.appendChild(new Option(c, c));
      });
    }

    // Special options for adding/editing categories
    category.appendChild(new Option('────────────', ''));
    category.appendChild(new Option('✏️ Edit selected category', '__edit'));
    category.appendChild(new Option('🗑️ Delete selected category', '__delete'));

    category.disabled = false;
  }

  // Handle Transaction Type Change
  type.addEventListener('change', () => {
    if (type.value === 'select') {
      category.disabled = true;
      category.innerHTML = `<option>Select Transaction Type first</option>`;
      return;
    }
    renderCategories(type.value);
  });

  // Handle Category Selection Actions (Edit/Delete custom logic)
  category.addEventListener('change', () => {
    const action = category.value;
    const cats = loadCategories();
    const typeVal = type.value;

    if (!action.startsWith('__')) {
      category.last = action;
      return;
    }

    if (action === '__edit') {
      if (!category.last) return;
      const updated = prompt('Edit category:', category.last);
      if (!updated) return;

      const i = cats[typeVal].indexOf(category.last);
      if (i !== -1) {
        cats[typeVal][i] = updated.trim();
        saveCategories(cats);
        renderCategories(typeVal);
        category.value = updated.trim();
      }
    }

    if (action === '__delete') {
      if (!category.last) return;
      cats[typeVal] = cats[typeVal].filter((c) => c !== category.last);
      saveCategories(cats);
      renderCategories(typeVal);
    }
  });

  // Handle "Add New Category" Button
  addCategoryBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (type.value === 'select') {
      alert('Select transaction type first');
      return;
    }

    const name = prompt('New category name:');
    if (!name) return;

    const cats = loadCategories();
    if (!cats[type.value]) cats[type.value] = [];
    cats[type.value].push(name.trim());
    saveCategories(cats);

    renderCategories(type.value);
    category.value = name.trim();
  });

  // Prefill form if editing an existing transaction
  if (editId) {
    const tx = transactions.find((t) => String(t.id) === editId);
    if (tx) {
      document.querySelector('h1').textContent = 'Edit Transaction';
      document.querySelector('.submit-btn').textContent = 'Update Transaction';

      item.value = tx.description || tx.item;
      type.value = tx.transactionType || tx.type;
      renderCategories(type.value);
      category.value = tx.categoryName || tx.category;
      date.value = tx.transactionDate || tx.date;
      amount.value = tx.amount;
    }
  }

  // Handle Form Submission - Transaction Initiated
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const tx = {
      id: editId ? Number(editId) : Date.now(),

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

      amount: Number(amount.value),
    };

    // Check if any required field is missing
    if (!tx.description || tx.type === 'select' || !tx.category || !tx.date || !tx.amount) {
      alert('Fill all fields');
      return;
    }

    // Refresh transactions before saving to avoid overwriting recent changes
    transactions = loadTransactions();

    // Check if we are in Edit Mode (Updating existing transaction)
    if (editId) {
      const index = transactions.findIndex((t) => String(t.id) === editId);
      // If transaction found, replace it
      if (index !== -1) {
        transactions[index] = tx;
      }
    } else {
      // If adding new, push to the list
      transactions.push(tx);
    }

    // Save updated list to storage
    saveTransactions(transactions);

    // Redirect to the Day View of the transaction's date
    const d = new Date(tx.date);
    location.href = `day.html?year=${d.getFullYear()}&month=${d.getMonth()}&day=${d.getDate()}`;
  });
})();
