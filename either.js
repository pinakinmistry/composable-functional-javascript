const Right = x => ({
  ap: other => other.map(x), 
  chain: f => f(x),
  map: f => Right(f(x)),
  fold: (f, g) => g(x),
  inspect: () => `Right(${x})` 
});

const Left = x => ({
  chain: f => Left(x),
  map: f => Left(x),
  fold: (f, g) => f(x),
  inspect: () => `Left(${x})`  
});

const fromNullable = x =>
  x != null ? Right(x) : Left(null);

//Helper for try catch
const tryCatch = (f) => {
  try {
    return Right(f());
  } catch(e) {
    return Left(e);
  }
}
module.exports = { Right, Left, fromNullable, tryCatch, of: Right }