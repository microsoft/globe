const { DateTimeFormatter, SHORT_DATE } = require('./');

const date = new Date(2020, 05, 25);
const expected = '6/25/2020';
const runs = 100;

// TODO: Add `SHORT_DATE` to observe keying works even with options provided
const dtf = new DateTimeFormatter('en-US');
const dtfStamp = Date.now();
const dtfLaps = [];
for (let index = 0; index < runs; index++) {
  const actual = dtf.formatDateTime(date);
  dtfLaps.push(Date.now());
  if (actual !== expected) {
    throw new Error(`${actual} !== ${expected}`);
  }
}

console.log(Date.now() - dtfStamp, 'total');
console.log('non-instant laps', dtfLaps.map((l, i) => l - (i === 0 ? dtfStamp : dtfLaps[i - 1])).filter(l => l));

const intl = new Intl.DateTimeFormat('en-US');
const intlStamp = Date.now();
const intlLaps = [];
for (let index = 0; index < runs; index++) {
  const actual = intl.format(date);
  intlLaps.push(Date.now());
  if (actual !== expected) {
    throw new Error(`${actual} !== ${expected}`);
  }
}

console.log(Date.now() - intlStamp, 'total');
console.log('non-instant laps', intlLaps.map((l, i) => l - (i === 0 ? intlStamp : intlLaps[i - 1])).filter(l => l));
