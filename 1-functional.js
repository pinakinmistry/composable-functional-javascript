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