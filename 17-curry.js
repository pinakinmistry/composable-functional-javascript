const add = x => y => x + y;

const inc = add(1) // y => 1 + y;

console.log(inc(2)); //3

const modulo = dvr => dvd => dvd % dvr;

const isOdd = modulo(2);

const filter = predicate => xs => xs.filter(predicate);

const getAllOlds = filter(isOdd);

console.log(getAllOlds([1, 2, 3, 4, 5])); //[1, 3, 5]

const replace = regex => replaceWith => str =>
  str.replace(regex, replaceWith);

const censor = replace(/[aeiou]/ig)('*');

console.log(censor('hello world')); //h*ll* w*rld

const map = f => xs => xs.map(f);

const censorAll = map(censor);

console.log(censorAll(['hello', 'world'])); //['h*ll*', 'w*rld']