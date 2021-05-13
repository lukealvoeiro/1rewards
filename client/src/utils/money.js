function legiblePrice(numCents) {
  const centsLeftOver = numCents % 100;
  let price = Math.floor(numCents / 100).toString();
  if (centsLeftOver > 9) {
    price += "." + centsLeftOver.toString();
  } else if (centsLeftOver === 0) {
    price += ".00";
  } else {
    price += ".0" + centsLeftOver.toString();
  }
  return "$" + price;
}

export default legiblePrice;
