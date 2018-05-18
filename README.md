# Composable Functional JavaScript

## `Box`

### Think inside the `Box`:


## 1. Linear data flow with container style types (`Box`)

### Imperative Approach:
- Procedural, multi statements
- Many intermediate states/variables
- Multiple function calls
- May have nested function calls

```js
const nextCharForNumberString = str => {
  const trimmed = str.trim();
  const number = parseInt(trimmed);
  const nextNumber = number + 1;
  return String.fromCharCode(nextNumber);
}

console.log(nextCharForNumberString(' 64 ')); //A

const nextCharForNumberStringNested = str =>
  String.fromCharCode(parseInt(str.trim()) + 1);

console.log(nextCharForNumberStringNested(' 64 ')); //A
```

### Functional Approach:
- Unnested functions
- Smaller, chainable functions avoiding assignments
- Linear data flow
- Container style type
- Functions excutes within a context (`Array/Box/.../Container`)

```js
//Using Array
const nextCharForNumberString = str =>
  [str]
  .map(s => s.trim())
  .map(s => parseInt(s))
  .map(i => i + 1)
  .map(i => String.fromCharCode(i))

console.log(nextCharForNumberString(' 64 ')); //['A']

//Using a custom container, say Box
const Box = x => ({
  map: f => Box(f(x)),
  inspect: () => `Box(${x})`
});

const nextCharForNumberStringUsingBox = str =>
  Box(str)
  .map(s => s.trim())
  .map(s => parseInt(s))
  .map(i => i + 1)
  .map(i => String.fromCharCode(i))

console.log(nextCharForNumberStringUsingBox(' 64 ')); //Box(A)
```

## 2. Refactor imperative code to a single composed expression using `Box`

### Imperative Approach:
```js
//Imperative
const moneyToFloat = str =>
  parseFloat(str.replace(/\$/g, ''));

const percentToFloat = str => {
  const replaced = parseFloat(str.replace(/\%/g, ''));
  const number = parseFloat(replaced);
  return number * 0.01;
};

const applyDiscount = (price, discount) => {
  const cost = moneyToFloat(price);
  const savings = percentToFloat(discount);
  return cost - cost * savings;
}

console.log(applyDiscount('$5.00', '20%')); //4
```

### Functional Approach:
```js
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

console.log(applyDiscount('$5.00', '20%')); //4
```

> `Box` supports linear data flow. How about branching? Here comes `Either`

## `Either`

### Where should I go? `Either` `Right` or `Left`:
- `Either = Right || Left;`
- `Right` container is for happy path when data is not `null` and function(s) need to be applied
- `Left` container is for unhappy path when data is `null` and function(s) need to be skipped
- Yay! these are containers for branching in a linear data flow

## 3. Common is `null` check with composable code branching using `Either`

### `Right` and `Left`:
```js
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
```