const Either = require('./either');

const liftA2 = (f, fx, fy) =>
  fx.map(f).ap(fy);

const $ = selector =>
  Either.of({selector, height: 10});

const getScreenSize = (screen, head, foot) =>
  screen - (head.height + foot.height);

$('header').chain(head =>
  $('footer').map(foot =>
    getScreenSize(800, head, foot)));

const getScreenSizeFunc = screen => head => foot =>
  screen - (head.height + foot.height);

const res1 = Either.of(getScreenSizeFunc(800))
  .ap($('header'))
  .ap($('footer'));
console.log(res1) //Right(780)

//or

const res2 = liftA2(getScreenSizeFunc(800), $('header'), $('footer'));
console.log(res2) //Right(780)

