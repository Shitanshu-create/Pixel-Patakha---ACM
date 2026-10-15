export const getErrorMessage = (error, defaultMsg = 'An unexpected error occurred.') => {
  if (!error) return defaultMsg;
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  return defaultMsg;
};

export default getErrorMessage;
