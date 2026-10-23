const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatPrice = (amount) => money.format(amount);

function toLocalISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const todayISO = () => toLocalISO(new Date());

export function addDaysISO(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toLocalISO(date);
}

export function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function daysBetween(fromISO, toISO) {
  const ms = new Date(`${toISO}T00:00:00`) - new Date(`${fromISO}T00:00:00`);
  return Math.round(ms / 86400000);
}
