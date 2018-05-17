# Composable Functional JavaScript

## 1. Linear data flow with container style types (Box):

Imperative Approach:
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

console.log(nextCharForNumberString(' 64 '));

const nextCharForNumberStringNested = str =>
  String.fromCharCode(parseInt(str.trim()) + 1);

console.log(nextCharForNumberStringNested(' 64 '));
```

Functional Approach:
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

console.log(nextCharForNumberStringUsingBox(' 64 '));
```