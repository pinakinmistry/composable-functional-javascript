const Sum = x => ({
  x,
  concat: ({ x: y }) => Sum(x + y),
  inspect: () => `Sum(${x})`,
});

//Promoted to a Monoid
Sum.empty = () => Sum(0);

console.log(Sum(1).concat(Sum(2)).concat(Sum.empty())); //Sum(3)

const All = x => ({
  x,
  concat: ({ x: y }) => All(x && y),
  inspect: () => `All(${x})`,
});

//Promoted to a Monoid
All.empty = () => All(true);

console.log(All.empty().concat(All(true).concat(All(true)))); //All(true)

const First = x => ({
  concat: _ => First(x),
  inspect: () => `First(${x})`,
});

//First cannot be promoted to a monoid as it simply throws away rest
First.empty = () => First('???');

console.log(First.empty().concat(First('Pinakin'))); //First('???')

const sum = xs =>
  xs.reduce((acc, x) => acc + x, 0);

console.log(sum([1, 2, 3])); //6
console.log(sum([])); //0

const all = xs =>
  xs.reduce((acc, x) => acc && x, true);

console.log(all([true, false])); //false
console.log(all([])); //false

const first = xs =>
  xs.reduce((acc, x) => acc);

console.log(first([1, 2, 3])); //1
console.log(first([])); //TypeError: Reduce of empty array with no initial value
  