const { Map, List } = require('immutable-ext');
const Sum = x => ({
  x,
  concat: ({ x: y }) => Sum(x + y),
  inspect: () => `Sum(${x})`,
});
Sum.empty = () => Sum(0);

const result = [Sum(1), Sum(2), Sum(3)]
  .reduce((acc, x) => acc.concat(x), Sum.empty());
console.log(result);  //Sum(6)

const resultWithList = List.of(Sum(1), Sum(2), Sum(3))
  .fold(Sum.empty());
console.log(resultWithList);  //Sum(6)

const resultWithMap = Map({brian: Sum(3), sarah: Sum(5)})
  .fold(Sum.empty());
console.log(resultWithMap); //Sum(8)

const resultWithMapFold = Map({brian: 3, sarah: 5})
  .map(Sum)
  .fold(Sum.empty());
console.log(resultWithMapFold); //Sum(8)

const resultWithFoldMap = Map({brian: 3, sarah: 5})
  .foldMap(Sum, Sum.empty());
console.log(resultWithFoldMap); //Sum(8)

const resultWithFoldMapList = List.of(1, 2, 3)
  .foldMap(Sum, Sum.empty());
console.log(resultWithFoldMap); //Sum(8)