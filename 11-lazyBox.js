const Box = x => ({
  fold: f => f(x),
  map: f => Box(f(x)),
  inspect: () => `Box(${x})`,
});

const resultWithBox = Box(' 64 ')
  .map(str => str.trim())
  .map(trimmed => new Number(trimmed))
  .map(number => number + 1)
  .map(nextNumber => String.fromCharCode(nextNumber))
  .fold(nextChar => nextChar.toLowerCase());

console.log(resultWithBox); //a

const LazyBox = g => ({
  fold: f => f(g()),
  map: f => LazyBox(() => f(g())),
});

const resultWithLazyBox = LazyBox(() => ' 64 ')
  .map(str => str.trim())
  .map(trimmed => new Number(trimmed))
  .map(number => number + 1)
  .map(nextNumber => String.fromCharCode(nextNumber))
  .fold(nextChar => nextChar.toLowerCase());

console.log(resultWithLazyBox); //a