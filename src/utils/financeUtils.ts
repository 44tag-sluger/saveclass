// Finance Utilities

// Calculate payment amount needed to pay off debt in a given time period
export const calculatePayment = (
  balance: number, 
  annualInterestRate: number, 
  months: number
): number => {
  if (months <= 0 || balance <= 0) return balance;
  
  const monthlyRate = annualInterestRate / 100 / 12;
  
  // If no interest rate, simple division
  if (annualInterestRate === 0) return balance / months;
  
  // Otherwise use compound interest formula
  return (
    (balance * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
    (Math.pow(1 + monthlyRate, months) - 1)
  );
};

// Sort debts by order for debt avalanche method (highest interest first)
export const sortDebtsForAvalanche = (debts: any[]): any[] => {
  return [...debts].sort((a, b) => b.interestRate - a.interestRate);
};

// Sort debts by order for debt snowball method (lowest balance first)
export const sortDebtsForSnowball = (debts: any[]): any[] => {
  return [...debts].sort((a, b) => a.balance - b.balance);
};

// Calculate inflation-adjusted value of money
export const calculateInflationAdjustedValue = (
  currentAmount: number,
  inflationRate: number,
  years: number
): number => {
  return currentAmount / Math.pow(1 + inflationRate / 100, years);
};

// Calculate future value with compound interest
export const calculateFutureValue = (
  principal: number,
  annualRate: number,
  years: number,
  compoundingPerYear: number = 1
): number => {
  const rate = annualRate / 100;
  return principal * Math.pow(1 + rate / compoundingPerYear, compoundingPerYear * years);
};

// Calculate monthly savings needed to reach a goal
export const calculateMonthlySavings = (
  goalAmount: number,
  annualRate: number,
  years: number
): number => {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  
  if (monthlyRate === 0) return goalAmount / months;
  
  return goalAmount * (monthlyRate / (Math.pow(1 + monthlyRate, months) - 1));
};

// Format currency for South African Rand
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Format percentage
export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};
