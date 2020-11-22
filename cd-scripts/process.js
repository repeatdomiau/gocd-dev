
const changesFile = process.argv[2];
const trace = x => { console.log(x); return x; }
const toString = obj => obj.toString();
const split = sep => text => text.split(sep);
const splitLines = split('\n');
const filter = fn => arr => arr.filter(fn);
const byTruthy = x => x;
const arrayToSet = arr => new Set(arr);
const setToArray = set => [...set];

if (changesFile) {
    require('fs')
        .promises
        .readFile(changesFile)
        .then(toString)
        .then(splitLines)
        .then(filter(byTruthy))
        .then(arrayToSet)
        .then(setToArray)
        .then(trace)
}