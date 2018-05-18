const Right = x => ({
  map: f => Right(f(x)),
  fold: (f, g) => g(x),
  inspect: () => `Right(${x})` 
});

const Left = x => ({
  map: f => Left(x),
  fold: (f, g) => f(x),
  inspect: () => `Left(${x})`  
});

console.log(
  Right(2)
  .map(x => x + 1)
  .map(x => x * 2)
); //Right(6)

console.log(
  Right(2)
  .map(x => x + 1)
  .map(x => x * 2)
  .fold(x => 'error', x => x)
); //6

console.log(
  Left(2)
  .map(x => x + 1)
  .map(x => x * 2)
); //Left(2)

console.log(
  Left(2)
  .map(x => x + 1)
  .map(x => x * 2)
  .fold(x => 'error', x => x)
); //Error