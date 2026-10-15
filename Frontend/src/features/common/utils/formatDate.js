export const formatDate = (dateInput, options = {}) => {
  if (!dateInput) return '—';
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '—';

    const defaultOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      ...options,
    };

    return new Intl.DateTimeFormat('en-IN', defaultOptions).format(date);
  } catch (err) {
    console.error('Date formatting error:', err);
    return String(dateInput);
  }
};

export const formatShortDate = (dateInput) => {
  return formatDate(dateInput, { hour: undefined, minute: undefined, hour12: undefined });
};

export default formatDate;
