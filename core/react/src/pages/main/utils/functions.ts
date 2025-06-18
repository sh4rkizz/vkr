export const pluralize = (number, one, two, five) => {
    let n = Math.abs(number);

    // Если не равно 0, то число дробное
    if (n % 1 !== 0) {
      return two;
    }

    n %= 100;
    if (n >= 5 && n <= 20) {
      return five;
    }

    n %= 10;
    if (n === 1) {
      return one;
    }

    if (n >= 2 && n <= 4) {
      return two;
    }

    return five;
  };

  export const roundNumber = (number, digits) => {
    if (number % 1 !== 0) {
      return number.toFixed(digits)
    }

    return number
  }

  export function fileType(filename) {
    let tokens = filename.split('.');
    if (tokens.length === 0) {
      return '';
    }
    return tokens[tokens.length - 1];
  }
