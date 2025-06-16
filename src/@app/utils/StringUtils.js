export function shortenAddress(value, start = 8, end = 5) {
  if (!value) return "";

  let startValue = value.substring(0, start);
  let endValue = value.substring(value.length - end);

  return startValue + "..." + endValue;
}

function str_pad_left(string, pad, length) {
  return (new Array(length + 1).join(pad) + string).slice(-length);
}

export function secondsToMinutesAndSeconds(value) {
  var minutes = Math.floor(value / 60);
  var seconds = value - minutes * 60;
  return (
    str_pad_left(minutes.toString(), "0", 2) +
    ":" +
    str_pad_left(seconds.toString(), "0", 2)
  );
}

//^[0-9]*\.[0-9][0-9]$
export const numberPattern = "^[0-9,.]*$"

export function parseThousandsToNumber(value) {
  const number = value.replace(/,/g, "")
  const numbers = number.split('.')
  if (numbers.length > 2) {
    return numbers[0] + '.' + numbers[1]
  }
  if (numbers.length === 2 && numbers[0] === "") {
    return "0." + numbers[1];
  }
  return number
}

export function numberWithCommas(x) {
  if (x) {
    x = String(x).replace(/,/g, "");
    const numbers = String(x).split('.')
    let result = new Intl.NumberFormat('en-US').format(numbers[0]) + (
      numbers.length > 1 ? `.${numbers[1]}` : ''
    );

    return result;
    // return x.toString().replace(/\d(?=(\d{3})+\.)/g, '$&,')
    // return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }else{
    return "";
  }
}

export function formatDecimal(number) {
  if(isNaN(number)) return "-"
  // Ensure the number has two decimal places
  const formattedNumber = number.toFixed(2);
  
  // Add thousand separators
  return formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}


export function formatDisplayETH(value) {
  if (typeof value === "string" && Number(value) === 0) return value;
  if (typeof value === "string") value = Number(value);
  // const zeros = 1000000;
  const zeros = 10000;
  return Math.floor(value.toFixed(5) * zeros) / zeros;
}

export function formatDisplayUSDT(value) {
  if (typeof value === "string") value = Number(value);
  // const zeros = 1000000;
  const zeros = 10000;
  return numberWithCommas(Math.floor(value?.toFixed(5) * zeros) / zeros);
}

export function formatDisplayUSDT2(value) {
  if (typeof value === "string") value = Number(value);
  // const zeros = 1000000;
  const zeros = 100;
  return numberWithCommas(Math.floor(value?.toFixed(3) * zeros) / zeros);
}

export function formatUSDT(value) {
  if (typeof value === "string" && Number(value) === 0) return value;
  if (typeof value === "string") value = Number(value);
  const zeros = 10000;
  return Math.floor(value.toFixed(5) * zeros) / zeros;
}

export function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}

export function validateEmail(value) {
  const regex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return regex.test(value)
}