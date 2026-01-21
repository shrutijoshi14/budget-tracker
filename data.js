/* ===============================
   GLOBAL DATA MANAGMENT
================================ */
const DATA_KEY = 'bt_transactions';
const DATA_YEAR_KEY = 'bt_currentYear';
const DATA_CAT_KEY = 'bt_categories';

/* -- Transactions -- */
function loadTransactions() {
  const data = localStorage.getItem(DATA_KEY);
  return data ? JSON.parse(data) : [];
}

function saveTransactions(transactions) {
  localStorage.setItem(DATA_KEY, JSON.stringify(transactions));
}

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

function getAllTransactions() {
  return loadTransactions().map(normalizeTransaction);
}

/* -- Categories -- */
function loadCategories() {
  const defaults = {
    income: ['Salary', 'Freelance'],
    expense: ['Grocery', 'Utility'],
    savings: ['Emergency Fund'],
  };
  const data = localStorage.getItem(DATA_CAT_KEY);
  return data ? JSON.parse(data) : defaults;
}

function saveCategories(categories) {
  localStorage.setItem(DATA_CAT_KEY, JSON.stringify(categories));
}

/* -- Year State -- */
function getGlobalYear() {
  return Number(localStorage.getItem(DATA_YEAR_KEY)) || new Date().getFullYear();
}

function setGlobalYear(year) {
  localStorage.setItem(DATA_YEAR_KEY, year);
}

/* -- Helpers -- */
function getTransactionsByYear(year) {
  return getAllTransactions().filter((t) => new Date(t.date).getFullYear() === Number(year));
}

function getTransactionsByMonth(year, month) {
  return getAllTransactions().filter((t) => {
    const d = new Date(t.date);
    return d.getFullYear() === Number(year) && d.getMonth() === Number(month);
  });
}

function sumTransactions(list, type) {
  return list.filter((t) => t.type === type).reduce((s, t) => s + Number(t.amount), 0);
}
