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



//Usage
let findColor = name =>
  ({red: '#ff0000', green: '#00ff00', blue: '#0000ff'})[name]

console.log(findColor('blue')); //#0000ff

console.log(findColor('blue').slice(1).toUpperCase()); //0000FF

//console.log(findColor('yellow').slice(1).toUpperCase()); //'slice' of undefined

//Using Right or Left
findColor = name => {
  const found = ({red: '#ff0000', green: '#00ff00', blue: '#0000ff'})[name];
  return found ? Right(found) : Left(null);
};

console.log(
  findColor('blue')
  .map(found => found.slice(1))
  .fold(e => 'color not found', color => color.toUpperCase())
); //0000FF

console.log(
  findColor('yellow')
  .map(found => found.slice(1))
  .fold(e => 'color not found', color => color.toUpperCase())
); //color not found

//Using fromNullable
const fromNullable = x =>
  x != null ? Right(x) : Left(null);

findColor = name =>
  fromNullable(({red: '#ff0000', green: '#00ff00', blue: '#0000ff'})[name]);

console.log(
  findColor('blue')
  .map(found => found.slice(1))
  .fold(e => 'color not found', color => color.toUpperCase())
); //0000FF

console.log(
  findColor('yellow')
  .map(found => found.slice(1))
  .fold(e => 'color not found', color => color.toUpperCase())
); //color not found