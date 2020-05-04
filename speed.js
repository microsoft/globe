const { DateTimeFormatter } = require('./');

const date = new Date(2020, 05, 25);
const expected = '6/25/2020';
const runs = 1000;

const dtf = new DateTimeFormatter('en-US');
const dtfStamp = new Date();
for (let index = 0; index < runs; index++) {
  const actual = dtf.formatDateTime(date);
  if (actual !== expected) {
    throw new Error(`${actual} !== ${expected}`);
  }
}

console.log(new Date() - dtfStamp);

const intl = new Intl.DateTimeFormat('en-US');
const intlStamp = new Date();
for (let index = 0; index < runs; index++) {
  const actual = intl.format(date, null);
  if (actual !== expected) {
    throw new Error(`${actual} !== ${expected}`);
  }
}

console.log(new Date() - intlStamp);
