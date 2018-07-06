// @flow

const ERROR_TEXT__INVALID_EXPIRY_DATE = 'Please enter a valid expiration date';
const ERROR_TEXT__MONTH_OUT_OF_RANGE = 'Expiry month must be between 01 and 12';
const ERROR_TEXT__YEAR_OUT_OF_RANGE = 'Your card is expired';

const EXPIRY_DATE_REGEX = /^(\d{2})\/(\d{4}|\d{2})$/;
const MONTH_REGEX = /(0[1-9]|1[0-2])/;

export default (expiryDate: string) => {
  const splitDate = expiryDate.split('/');
  if (!EXPIRY_DATE_REGEX.test(expiryDate)) {
    return ERROR_TEXT__INVALID_EXPIRY_DATE;
  }

  const expiryMonth = splitDate[0];
  if (!MONTH_REGEX.test(expiryMonth)) {
    // BA want
    return ERROR_TEXT__INVALID_EXPIRY_DATE;
    // return ERROR_TEXT__MONTH_OUT_OF_RANGE;
  }

  const expiryYear = splitDate[1];
  const current = new Date();
  let currentYear = current.getFullYear();
  currentYear = parseInt(
    expiryYear.length === 4 ? currentYear : currentYear.toString().substr(-2),
    10
  );

  const isSameYear = currentYear === parseInt(expiryYear, 10);

  if (
    currentYear > parseInt(expiryYear, 10) ||
    (isSameYear && parseInt(expiryMonth, 10) < current.getMonth() + 1)
  ) {
    return ERROR_TEXT__YEAR_OUT_OF_RANGE;
  }

  return false;
};

export {
  ERROR_TEXT__INVALID_EXPIRY_DATE,
  ERROR_TEXT__MONTH_OUT_OF_RANGE,
  ERROR_TEXT__YEAR_OUT_OF_RANGE
};
