//Imperative approach
const moneyToFloat = str =>
  parseFloat(str.replace(/\$/g, ''));

const percentToFloat = str => {
  const replaced = parseFloat(str.replace(/\%/g, ''));
  const number = parseFloat(replaced);
  return number * .01;
};

const applyDiscount = (price, discount) => {
  const cost = moneyToFloat(price);
  const savings = percentToFloat(discount);
  return cost - cost * savings;
}

console.log(applyDiscount('$5.00', '20%')); //4