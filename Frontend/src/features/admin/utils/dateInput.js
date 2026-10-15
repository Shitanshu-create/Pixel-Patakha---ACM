export const toDatetimeLocal = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    // YYYY-MM-DDTHH:mm
    const pad = (n) => String(n).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (err) {
    return '';
  }
};

export const fromDatetimeLocal = (datetimeLocalString) => {
  if (!datetimeLocalString) return null;
  const date = new Date(datetimeLocalString);
  return isNaN(date.getTime()) ? null : date.toISOString();
};

export const toDateTimeLocalValue = toDatetimeLocal;
export const toIsoStringOrNull = fromDatetimeLocal;

export default {
  toDatetimeLocal,
  fromDatetimeLocal,
  toDateTimeLocalValue,
  toIsoStringOrNull,
};
