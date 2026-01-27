export const formatCurrency = (val) =>
  val == null ? "-" : Number(val).toLocaleString("en-US", { minimumFractionDigits: 2 });

export const formatDate = (val) => {
  if (!val) return "-";
  const d = new Date(val);
  return isNaN(d) ? val : d.toLocaleDateString("en-GB").toUpperCase();
};

export const formatPeriod = (val) => {
  if (!val) return "-";
  const d = new Date(val);
  return isNaN(d)
    ? val
    : d.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();
};
