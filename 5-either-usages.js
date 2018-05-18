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

console.log(getPrefs({ premium: true, preferences: 'netflix' }));

const getPrefsFunc = user =>
  (user.premium ? Right(user) : Left('not premium'))
  .map(user => user.preferences)
  .fold(() => defaultPrefs, loadPrefs);

console.log(getPrefsFunc({ premium: true, preferences: 'netflix' }));
