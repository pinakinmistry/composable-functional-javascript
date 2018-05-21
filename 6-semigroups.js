//Sum SemiGroup for addition
const Sum = x => ({
  x,
  concat: ({ x: y }) => Sum(x + y),
  inspect: () => `Sum(${x})`,
});

console.log(Sum(1).concat(Sum(2))); //Sum(3)


//All SemiGroup for conjunction
const All = x => ({
  x,
  concat: ({ x: y }) => All(x && y),
  inspect: () => `All(${x})`,
});

console.log(All(true).concat(All(false))); //Sum(false)
console.log(All(true).concat(All(true))); //Sum(true)


//First SemiGroup to keep first and ingore rest
const First = x => ({
  concat: _ => First(x),
  inspect: () => `First(${x})`,
});

console.log(First('blah').concat('rest').concat('in peace')) //First(blah)
