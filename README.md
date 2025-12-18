# Expense Tracker

## Overview

The **Expense Tracker** is a web‑based application that allows users to track their **income, expenses, savings, and net balance** on a monthly basis. It provides a clear financial overview using summaries, category breakdowns, and transaction listings.

The application is built using **HTML, CSS, and JavaScript** and stores data locally using **browser localStorage**, so no backend is required.

Live Demo: https://shrutijoshi14.github.io/budget-tracker

---

## Features

- Add income and expense transactions
- View total transactions, income, expenses, and savings
- Monthly overview cards
- Category‑wise expense breakdown
- Transaction list with category labels
- Responsive UI using CSS Grid
- Persistent data using localStorage

---

## How to Use the Expense Tracker

1. Open the application using the GitHub Pages link.
2. Select a month or navigate through the dashboard.
3. Click on **Add Details** or similar action to add a transaction.
4. Choose the transaction type (Income / Expense / Savings).
5. Enter amount, category, and date.
6. View updated summaries, category breakdowns, and transaction list.

All data is saved automatically in your browser.

---

## Project Structure

```
budget-tracker/
│
├── index.html                        # Main dashboard
├── day.html                          # Daily transaction view
├── style.css                         # Global styles
├── script.js                         # Main logic & calculations
├── months.js                         # Monthly data handling
├── months-overview.html              # All months data showed for a year
├── add-transaction-form.js           # Transaction Form with validiation
├── add-form.js                       # Validations for category & whole form
└── assets/                           # Icons and images
```

---

## Code Documentation

### HTML

- Provides the base structure of the application
- Uses semantic elements and reusable containers
- Dashboard cards, transaction lists, and category sections are defined here

### CSS

- Uses **CSS Grid and Flexbox** for layout
- Ensures responsive behavior across screen sizes
- Consistent color system for income, expense, and savings
- Card‑based UI with shadows and rounded corners

### JavaScript

#### Data Handling

- Uses JavaScript objects and arrays to store transaction data
- Each transaction includes:
  - Amount
  - Category
  - Type (Income / Expense / Savings)
  - Date

#### localStorage

- All transactions are stored in browser localStorage
- Data persists even after page refresh

#### Calculations

- Total transactions count
- Total income
- Total expenses
- Total savings
- Average expense calculation

#### Rendering

- JavaScript dynamically updates:
  - Summary cards
  - Transaction list
  - Category breakdown

---

## Responsiveness

- Layout adapts using CSS Grid
- Cards stack vertically on smaller screens
- Font sizes and spacing adjust for mobile devices

---

## Technologies Used

- HTML5
- CSS3 (Grid & Flexbox)
- JavaScript (ES6)
- Browser localStorage

---

## Future Improvements

- Export transactions as CSV
- Add charts for better visualization
- Add user authentication
- Backend database integration

---

## Conclusion

This Expense Tracker is a lightweight, responsive, and user‑friendly web application that fulfills all core requirements for tracking personal finances. The clean structure and documentation make it easy to understand, extend, and maintain.
