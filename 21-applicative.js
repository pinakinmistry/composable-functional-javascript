const Task = require('data.task');

const Db = ({
  find: id =>
    new Task((rej, res) =>
      setTimeout(() =>
        res({id, title: `Project ${id}`}), 100))
});

const reportHeader = (p1, p2) =>
  `Report ${p1.tile} compared to ${p2.title}`

Db.find(20).chain(p1 =>
  Db.find(10).map(p2 =>
    reportHeader(p1, p2)));

//Parellel tasks
Task.of(p1 => p2 => reportHeader(p1, p2))
  .ap(Db.find(20))
  .ap(Db.find(10))
  .fork(console.error, console.log)