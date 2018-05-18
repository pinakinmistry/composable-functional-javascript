# Composable Functional JavaScript

## 1. Linear data flow with container style types (Box):

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
- Functions excutes within a context (Array/Box/.../Container)

```js
//Using Array
const nextCharForNumberString = str =>
  [str]
  .map(s => s.trim())
  .map(s => parseInt(s))
  .map(i => i + 1)
  .map(i => String.fromCharCode(i))

console.log(nextCharForNumberString(' 64 ')); // ['A']

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

## 2. Refactor imperative code to a single composed expression using Box:

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