function formatAmount(value) {
  if (value === 0 || value === undefined || value === null || isNaN(value)) {
    return '-';
  }

  const num = Number(value);

  //This is the Indian formatting version with , like 1,00,000
  return `₹${
    num % 1 === 0
      ? num.toLocaleString('en-IN')
      : num.toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
  }`;

  //This is the normal formatting version without , like 100000
  // return `₹${num % 1 === 0 ? num : num.toFixed(2)}`;
}
