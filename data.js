// LocalStorage keys
const DATA_KEY = 'bt_transactions';
const DATA_YEAR_KEY = 'bt_currentYear';
const DATA_CAT_KEY = 'bt_categories';

// Load all transactions from local storage
function loadTransactions() {
  const data = localStorage.getItem(DATA_KEY);
  return data ? JSON.parse(data) : [];
}

// Save transactions to local storage
function saveTransactions(transactions) {
  localStorage.setItem(DATA_KEY, JSON.stringify(transactions));
}

// Standardize transaction object structure
function normalizeTransaction(tx) {
  return {
    id: tx.id,
    description: tx.description || tx.item || 'Untitled',
    type: tx.type || tx.transactionType || '',
    category: tx.category || tx.categoryName || '',
    date: tx.date || tx.transactionDate || '',
    amount: Number(tx.amount || 0),
  };
}

// Get all transactions normalized
function getAllTransactions() {
  return loadTransactions().map(normalizeTransaction);
}

// Load categories or return defaults if none exist
function loadCategories() {
  const defaults = {
    income: ['Salary', 'Freelance'],
    expense: ['Grocery', 'Utility'],
    savings: ['Emergency Fund'],
  };
  const data = localStorage.getItem(DATA_CAT_KEY);
  return data ? JSON.parse(data) : defaults;
}

// Save categories to local storage
function saveCategories(categories) {
  localStorage.setItem(DATA_CAT_KEY, JSON.stringify(categories));
}

// Get the currently selected global year
function getGlobalYear() {
  return Number(localStorage.getItem(DATA_YEAR_KEY)) || new Date().getFullYear();
}

// Set the currently selected global year
function setGlobalYear(year) {
  localStorage.setItem(DATA_YEAR_KEY, year);
}

// Filter transactions by a specific year
function getTransactionsByYear(year) {
  return getAllTransactions().filter((t) => new Date(t.date).getFullYear() === Number(year));
}

// Filter transactions by a specific month and year
function getTransactionsByMonth(year, month) {
  return getAllTransactions().filter((t) => {
    const d = new Date(t.date);
    return d.getFullYear() === Number(year) && d.getMonth() === Number(month);
  });
}

// Sum transaction amounts by type (income, expense, savings)
function sumTransactions(list, type) {
  return list.filter((t) => t.type === type).reduce((s, t) => s + Number(t.amount), 0);
}
