const Box = require('./2-functional');

//Principle 1
const res1 = Box('squirrels')
  .map(s => s.substr(5))
  .map(s => s.toUpperCase());

const res2 = Box('squirrels')
  .map(s => s.substr(5).toUpperCase());

console.log(res1, res2);

//Principle 2
const id = x => x;

const res3 = Box('crayons').map(id);
const res4 = id(Box('crayons'));

console.log(res3, res4);
