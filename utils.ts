
export const formatIndianCurrency = (amount: number): string => {
  const ONE_LAKH = 100000;
  const ONE_CRORE = 10000000;

  if (amount >= ONE_CRORE) {
    return `₹${(amount / ONE_CRORE).toFixed(2)}Cr`;
  } else if (amount >= ONE_LAKH) {
    return `₹${(amount / ONE_LAKH).toFixed(2)}L`;
  } else {
    // For amounts less than 1 Lakh, use standard Indian locale string for commas
    // Ensure to handle potential floating point inaccuracies if amount could have paisa
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }
};
