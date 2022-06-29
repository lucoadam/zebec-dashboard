export const formatCurrency = (amount: number, before: string = "") => {
  return before + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};
