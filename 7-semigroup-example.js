const { Map } = require('immutable-ext');

const Sum = x => ({
  x,
  concat: ({ x: y }) => Sum(x + y),
  inspect: () => `Sum(${x})`,
});

const All = x => ({
  x,
  concat: ({ x: y }) => All(x && y),
  inspect: () => `All(${x})`,
});

const First = x => ({
  concat: _ => First(x),
  inspect: () => `First(${x})`,
});

const acct1 = Map({
  name: First('Pinakin N Mistry'),
  isPaid: All(true),
  points: Sum(10),
  friends: ['Preeti'],
});

const acct2 = Map({
  name: First('Pinakin Mistry'),
  isPaid: All(false),
  points: Sum(20),
  friends: ['Priya'],
});

console.log(acct1.concat(acct2).toJS());
/*
OUTPUT:
{
  name: First(Pinakin N Mistry),
  isPaid: All(false),
  points: Sum(30),
  friends: [ 'Preeti', 'Priya' ]
}
*/