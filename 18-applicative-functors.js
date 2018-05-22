const Box = x => ({
  ap: b2 => b2.map(x),
  map: f => Box(f(x)),
  fold: f => f(x),
  inspect: () => `Box(${x})`
});

const res1 = Box(x => x + 1).ap(Box(2));
console.log(res1); //Box(3)

const add = x => y => x + y;
const res2 = Box(add).ap(Box(2)).ap(Box(3)) //Box(y => 2 + y).ap(Box(3))
console.log(res2); //Box(5)

/*
Thus, we have F(x).map(f) == F(f).ap(F(x)) as a principle of applicative functors

Now lets take a function and apply it to 2 functors of any Functor type F
const liftA2 = (f, fx, fy) =>
  F(f).ap(fx).ap(fy);

But Functor type F needs to be generic.
Based on principle of applicative functor, F(f).ap(F(x)) == F(x).map(f)

Thus we can modify lift2A2 as below:
*/

const liftA2 = (f, fx, fy) =>
  fx.map(f).ap(fy);

const res3 = liftA2(add, Box(2), Box(3));
console.log(res3); //Box(5)

const liftA3 = (f, fx, fy, fz) =>
  fx.map(f).ap(fy).ap(fz);

const add2 = x => y => z => x + y + z;
const res4 = liftA3(add2, Box(2), Box(3), Box(4))
console.log(res4); //Box(9)