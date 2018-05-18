const Right = x => ({
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

const fs = require('fs');

//Imperative
let getPort = (configFile) => {
  try {
    const str = fs.readFileSync(configFile);
    const config = JSON.parse(str);
    return config.port;
  } catch(e) {
    return 3000;
  }
};

console.log(getPort('4-config.json')); //8888
console.log(getPort('noSuchFile.json')); //3000

//Helper for try catch
const tryCatch = (f) => {
  try {
    return Right(f());
  } catch(e) {
    return Left(e);
  }
}

//Functional
getPort = (configFile) =>
  tryCatch(() => fs.readFileSync(configFile))
  .map(c => JSON.parse(c))
  .fold(e => 3000, c => c.port);

console.log(getPort('4-config.json')); //8888
console.log(getPort('noSuchFile.json')); //3000

//What if JSON.parse throws an error
getPort = (configFile) =>
  tryCatch(() => fs.readFileSync(configFile)) //Right(...)
  .map(c => tryCatch(() => JSON.parse(c)))  //Right(Left(e)) or Right(Right(...))
  .fold(e => 3000, c => c.port);

console.log(getPort('4-config.json')); //undefined

getPort = (configFile) =>
  tryCatch(() => fs.readFileSync(configFile)) //Right(...)
  .chain(c => tryCatch(() => JSON.parse(c)))  //Right(...) or Left(e)
  .fold(e => 3000, c => c.port);

console.log(getPort('4-config.json')); //8888
console.log(getPort('noSuchFile.json')); //3000