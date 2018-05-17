//Single composed expression using Box
const Box = x => ({
  map: f => Box(f(x)),
  fold: f => f(x),
  inspect: () => `Box(${x})`
});

const moneyToFloat = str =>
  Box(str.replace(/\$/g, ''))
  .map(replaced => parseFloat(replaced));

const percentToFloat = str =>
  Box(str.replace(/\%/g, ''))
  .map(replaced => parseFloat(replaced))
  .map(number => number * .01);

const applyDiscount = (price, discount) =>
  moneyToFloat(price)
  .fold(cost =>
    percentToFloat(discount)
    .fold(savings =>
      cost - cost * savings));

console.log(applyDiscount('$5.00', '20%'));