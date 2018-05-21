# Composable Functional JavaScript

Using
- Box
- Either (Right or Left)
- fromNullable
- SemiGroup

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

## 4. Use `chain` for composable error handling with nested `Either`s

```js
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
```

## 5. More examples on usage of `Either`:

### Example 1:
```js
//Imperative
const openSite = (currentUser) => {
  if(currentUser) {
    return renderPage(currentUser);
  } else {
    return showLogin();
  }
};

//Functional
const openSiteFunc = (currentUser) =>
  fromNullable(currentUser)
  .fold(showLogin, renderPage);
```

### Example 2:
```js
//Imperative
const loadPrefs = pref => {
  console.log(`loading ${pref}`);
};
const defaultPrefs = 'default prefs';

const getPrefs = user => {
  if(user.premium) {
    return loadPrefs(user.preferences);
  } else {
    return defaultPrefs;
  }
};

console.log(getPrefs({ premium: true, preferences: 'netflix' })); //loading netflix

const getPrefsFunc = user =>
  (user.premium ? Right(user) : Left('not premium'))
  .map(user => user.preferences)
  .fold(() => defaultPrefs, loadPrefs);

console.log(getPrefsFunc({ premium: true, preferences: 'netflix' })); //loading netflix
```

### Example 3:
```js
//Imperative
const user = { address: { street: {name: 'Main street'} } };
const streetName = user => {
  const address = user.address;
  if(address) {
    const street = address.street;
    if(street) {
      return street.name;
    }
    return 'no street';
  }
}

console.log(streetName(user)); //Main street

//Functional
const streetNameFunc = user =>
  fromNullable(user.address)
  .chain((address) => fromNullable(address.street))
  .map((street) => street.name)
  .fold(() => 'no street', streetName => streetName);

console.log(streetNameFunc(user)); //Main street
```

### Example 4:
```js
//Imperative
const concatUniq = (x, ys) => {
  const found = ys.filter(y => y === x)[0];
  return found ? ys : ys.concat(x);
}

console.log(concatUniq(3, [1, 2])); //[1, 2, 3]
console.log(concatUniq(2, [1, 2])); //[1, 2]

const concatUniqFunc = (x, ys) =>
  fromNullable(ys.filter(y => y === x)[0])
  .fold(() => ys.concat(x), () => ys);

console.log(concatUniqFunc(3, [1, 2])); //[1, 2, 3]
console.log(concatUniqFunc(2, [1, 2])); //[1, 2]
```

### Example 5:
```js
//Imperative
const fs = require('fs');
const wrapExamples = example => {
  if(example.previewPath) {
    try {
      example.preview = fs.readFileSync(example.previewPath).toString();
    } catch(e) {}
  }
  return example;
};

console.log(wrapExamples({previewPath: 'noSuchFile.js'})); //{ previewPath: 'noSuchFile.js' }
console.log(wrapExamples({previewPath: '4-config.json'})); //{ previewPath: '4-config.json', preview: '{ "port": 8888 }' }

//Functional
const wrapExamplesFunc = example =>
  fromNullable(example.previewPath)
  .chain((previewPath) => tryCatch(() => fs.readFileSync(previewPath).toString()))
  .fold(() => example, (preview) => Object.assign(example, { preview }));

console.log(wrapExamplesFunc({previewPath: 'noSuchFile.js'})); //{ previewPath: 'noSuchFile.js' }
console.log(wrapExamplesFunc({previewPath: '4-config.json'})); //{ previewPath: '4-config.json', preview: '{ "port": 8888 }' }
```

### Example 6:
```js
//Imperative
const parseDbUrl = cfg => {
  try {
    const c = JSON.parse(cfg);
    if(c.url) {
      return c.url.match(/http:\/\/someurl/);
    }
  } catch (e) {
    return null;
  }
};

console.log(parseDbUrl('{ "url": "http://someurl" }')); //[ 'http://someurl', index: 0, input: 'http://someurl' ]

//Functional
const parseDbUrlFunc = cfg =>
  tryCatch(() => JSON.parse(cfg))
  .chain(c => fromNullable(c.url))
  .fold(() => null, url => url.match(/http:\/\/someurl/));

console.log(parseDbUrlFunc('{ "url": "http://someurl" }')); //[ 'http://someurl', index: 0, input: 'http://someurl' ]
```

## `SemiGroups`
- Combines two types into one.
- A container type with `.concat()` method that are associative
- Associate: `(x + y) + z === x + (y + z)`
- `String` and `Array` are examples of SemiGroups
- `('a'.concat('b')).concat('c') === 'a'.(concat('b').concat('c'))`
- `([1, 2].concat([3, 4])).concat([5, 6]) === [1, 2].(concat([3, 4]).concat([5, 6]))`
- Name SemiGroup comes from abstract algebra

## 6. Create Types with `SemiGroups`

```js
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
```

## 7. SemiGroup example:

- Combining 2 accounts into one
- `name` as is from any account
- `isPaid` only if both accounts is paid
- `points` to be summed together
- `friends` to be concatenated together

```js
const { Map } = require('immutable-ext');

const Sum = x => ({
  x,
  concat: ({ x: y }) => Sum(x + y),
  inspect: () => `Sum(${x})`,
});

const All = x => ({
  x,
  concat: ({ x: y }) => All(x && y),
  inspect: () => `All(${x})`,
});

const First = x => ({
  concat: _ => First(x),
  inspect: () => `First(${x})`,
});

const acct1 = Map({
  name: First('Pinakin N Mistry'),
  isPaid: All(true),
  points: Sum(10),
  friends: ['Preeti'],
});

const acct2 = Map({
  name: First('Pinakin Mistry'),
  isPaid: All(false),
  points: Sum(20),
  friends: ['Priya'],
});

console.log(acct1.concat(acct2).toJS());
/*
OUTPUT:
{
  name: First(Pinakin N Mistry),
  isPaid: All(false),
  points: Sum(30),
  friends: [ 'Preeti', 'Priya' ]
}
*/
```

## `Monoid`:
- A `SemiGroup` with a special element that acts as a neutral identity
- A `SemiGroup` can be promoted to a `Monoid` with `empty()` method that returns the neutral element
- Fail safe as compare to `SemiGroup` as it has a neutral element to return without any harm

## 8. Ensure failsafe combination using `Monoid`s

```js
const Sum = x => ({
  x,
  concat: ({ x: y }) => Sum(x + y),
  inspect: () => `Sum(${x})`,
});

//Promoted to a Monoid
Sum.empty = () => Sum(0);

console.log(Sum(1).concat(Sum(2)).concat(Sum.empty())); //Sum(3)

const All = x => ({
  x,
  concat: ({ x: y }) => All(x && y),
  inspect: () => `All(${x})`,
});

//Promoted to a Monoid
All.empty = () => All(true);

console.log(All.empty().concat(All(true).concat(All(true)))); //All(true)

const First = x => ({
  concat: _ => First(x),
  inspect: () => `First(${x})`,
});

//First cannot be promoted to a monoid as it simply throws away rest
First.empty = () => First('???');

console.log(First.empty().concat(First('Pinakin'))); //First('???')

const sum = xs =>
  xs.reduce((acc, x) => acc + x, 0);

console.log(sum([1, 2, 3])); //6
console.log(sum([])); //0

const all = xs =>
  xs.reduce((acc, x) => acc && x, true);

console.log(all([true, false])); //false
console.log(all([])); //false

const first = xs =>
  xs.reduce((acc, x) => acc);

console.log(first([1, 2, 3])); //1
console.log(first([])); //TypeError: Reduce of empty array with no initial value
```

## 9. More examples on usage of `Monoid`s

### Example 1:
```js
const Product = x => ({
  x,
  concat: ({ x: y }) => Product(x * y),
});
Product.empty = () => Product(1);
```

### Example 2:
```js
const Any = x => ({
  x,
  concat: ({ x: y }) => Any(x || y),
});
Any.empty = () => Any(false);
```

### Example 3:
```js
const Max = x => ({
  x,
  concat: ({ x: y }) => Max(x > y ? x : y),
});
Max.empty = () => Max(-Infinity);
```

### Example 4:
```js
const Max = x => ({
  x,
  concat: ({ x: y }) => Max(x > y ? x : y),
});
Max.empty = () => Max(-Infinity);
```

### Example 5:
```js
const Min = x => ({
  x,
  concat: ({ x: y }) => Min(x < y ? x : y),
});
Min.empty = () => Min(Infinity);
```

### Example 6:
```js
const Right = x => ({
  fold: (f, g) => g(x),
  map: f => Right(f(x)),
  concat: o =>
    o.fold(e => Left(e), r => Right(x.concat(r)));
});

const Left = x => ({
  fold: (f, g) => f(x),
  map: f => Left(x),
  concat: f => Left(x),
});

let stats = List.of({ page: 'Home', views: 40 },
  { page: 'About', views: 10 },
  { page: 'Blog', views: 4 });

stats.foldMap(x =>
  fromNullable(x.views).map(Sum), Right(Sum(0))); //Right(Sum(52))

stats = List.of({ page: 'Home', views: 40 },
  { page: 'About', views: 10 },
  { page: 'Blog', views: null });

stats.foldMap(x =>
  fromNullable(x.views).map(Sum), Right(Sum(0))); //Left(null)
```

### Example 7:
```js
const First = either => ({
  fold: f => f(either),
  concat: o => either.isLeft ? o : First(either),
});

First.empty = () => First(Left());

const find = (xs, f) =>
  List(xs)
  .foldMap(x =>
    First(f(x) ? Right(x) : Left()), First.empty())
  .fold(x => x);

find([3, 4, 5, 6, 7], x => x > 4); //Right(5)
```

### Example 8:
```js
const Fn = f => ({
  fold: f,
  concat: o => Fn(x => f(x).concat(o.fold(x)))
});

const hasVowels = x => !!x.match(/[aeiou]/ig);
const longWord = x => x.length >= 5;

let both = Fn(compose(All, hasVowels))
  .concat(Fn(compose(All, longWord)));

['gym', 'bird', 'lilac']
.filter(x => both.fold(x).x); //['lilac']

both = Fn(compose(Any, hasVowels))
  .concat(Fn(compose(Any, longWord)));

['gym', 'bird', 'lilac']
.filter(x => both.fold(x).x); //['bird', 'lilac']
```

### Example 9:
```js
const Pair = (x, y) => ({
  x,
  y,
  concat: ({ x: x1, y: y1 }) => Pair(x.concat(x1), y.concat(y1)),
});
```

## 10. Unbox types  with `foldMap`:

```js
const { Map, List } = require('immutable-ext');
const Sum = x => ({
  x,
  concat: ({ x: y }) => Sum(x + y),
  inspect: () => `Sum(${x})`,
});
Sum.empty = () => Sum(0);

const result = [Sum(1), Sum(2), Sum(3)]
  .reduce((acc, x) => acc.concat(x), Sum.empty());
console.log(result);  //Sum(6)

const resultWithList = List.of(Sum(1), Sum(2), Sum(3))
  .fold(Sum.empty());
console.log(resultWithList);  //Sum(6)

const resultWithMap = Map({brian: Sum(3), sarah: Sum(5)})
  .fold(Sum.empty());
console.log(resultWithMap); //Sum(8)

const resultWithMapFold = Map({brian: 3, sarah: 5})
  .map(Sum)
  .fold(Sum.empty());
console.log(resultWithMapFold); //Sum(8)

const resultWithFoldMap = Map({brian: 3, sarah: 5})
  .foldMap(Sum, Sum.empty());
console.log(resultWithFoldMap); //Sum(8)

const resultWithFoldMapList = List.of(1, 2, 3)
  .foldMap(Sum, Sum.empty());
console.log(resultWithFoldMap); //Sum(8)
```

## `LazyBox`
- Takes a function `g` instead of a value `x`
- Executes only when `fold()` method is called
- So no impure side effects
- Helps achieve purity by virtue of laziness
- Similar to types like `Promise`, `Observable` and `Stream`

## 11. Delay evaluation with LazyBox
```js
const Box = x => ({
  fold: f => f(x),
  map: f => Box(f(x)),
  inspect: () => `Box(${x})`,
});

const resultWithBox = Box(' 64 ')
  .map(str => str.trim())
  .map(trimmed => new Number(trimmed))
  .map(number => number + 1)
  .map(nextNumber => String.fromCharCode(nextNumber))
  .fold(nextChar => nextChar.toLowerCase());

console.log(resultWithBox); //a

const LazyBox = g => ({
  fold: f => f(g()),
  map: f => LazyBox(() => f(g())),
});

const resultWithLazyBox = LazyBox(() => ' 64 ')
  .map(str => str.trim())
  .map(trimmed => new Number(trimmed))
  .map(number => number + 1)
  .map(nextNumber => String.fromCharCode(nextNumber))
  .fold(nextChar => nextChar.toLowerCase());

console.log(resultWithLazyBox); //a
```

## 12. Capture side effects in a `Task`
```js
const Task = require('data.task');

Task.of(1) //Task(1)
.fork(e => console.log('err', e),
  x => console.log('success', x)); // success 1

Task.rejected(1) //Task(1)
.fork(e => console.log('err', e),
  x => console.log('success', x)); // err 1

Task.rejected(1) //Task(1)
.map(x => x + 1)
.fork(e => console.log('err', e),
  x => console.log('success', x)); // err 1

Task.of(1) //Task(1)
.map(x => x + 1)
.fork(e => console.log('err', e),
  x => console.log('success', x)); // success 2

Task.of(1) //Task(1)
.chain(x => Task.of(x + 1))
.map(x => x + 1)
.fork(e => console.log('err', e),
  x => console.log('success', x)); // success 3

const launchMissiles = () =>
  new Task((rej, res) => {
    console.log('launching missiles');
    res('missile');
  });

launchMissiles()
.map(x => x + '!')
.fork(e => console.log('err', e),
  x => console.log('success', x));
/*
launcging missiles
success missile!
*/

//Baseline app
const app = launchMissiles().map(x => x + '!');

//Extending baseline app
app
.map(x => x + '!')
.fork(
  e => console.log('err', x),
  x => console.log('success', x)
);
```

## 13. Use `Task` for asynchronous actions
```js
const Task = require('data.task');
const fs = require('fs');

const app = () =>
  fs.readFile('config.json', 'utf-8', (err, contents) => {
    if(err) throw err;
    const newContents = contents.replace(/8/g, '6');
    fs.writeFile('config1.json', newContents, (err, _) => {
      if(err) throw err;
      console.log('success');
    });
  });

//Using Task
const readFile = (filename, enc) =>
  new Task((rej, res) =>
    fs.readFile(filename, enc, (err, contents) =>
      err ? rej(err) : res(contents)));

const writeFile = (filename, contents) =>
  new Task((rej, res) =>
    fs.writeFile(filename, contents, (err, success) =>
      err ? rej(err) : res(success)));

const app = () =>
  readfile('config.json', 'utf-8')
  .map(contents => contents.replace(/8/g, '6'))
  .chain(contents => writeFile('config1.json', contents));

app().fork(
  e => console.log(e),
  success => console.log(success)
);
```