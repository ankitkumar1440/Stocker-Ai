export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPercentage = (amount: number): string => {
  const sign = amount > 0 ? '+' : '';
  return `${sign}${amount.toFixed(2)}%`;
};
