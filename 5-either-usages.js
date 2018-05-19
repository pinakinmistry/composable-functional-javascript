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

const tryCatch = f => {
  try {
    return Right(f());
  } catch(e) {
    return Left(e);
  }
};

//Example 1:
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


//Example 2:
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


//Example 3:
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


//Example 4:
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


//Example 5:
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


//Example 6
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