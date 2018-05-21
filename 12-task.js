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