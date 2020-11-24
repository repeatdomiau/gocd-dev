const fs = require('fs');
const path = require('path');

const compose = (...fns) => (...args) => fns.reduce((res, fn) => [fn.call(null, ...res)], args)[0];
const trace = x => { console.log(x); return x; }
const toString = obj => obj.toString();
const split = sep => text => text.split(sep);
const splitLines = split('\n');
const filter = fn => arr => arr.filter(fn);
const byTruthy = x => x;
const arrayToSet = arr => new Set(arr);
const setToArray = set => [...set];

const readLines = compose(fs.readFileSync, toString, splitLines);
const changes = readLines('../changed-json-files.txt');
const relevantLines = changes.filter(x => !x.startsWith('COMMIT') && x);

const relevantFiles = [...relevantLines.reduce((res, line) => {
    if (line.startsWith('ADDED') || line.startsWith('MODIFIED')) {
        res.add(line.split(' ')[1]);
    }
    else if (line.startsWith('DELETED')) {
        res.delete(line.split(' ')[1]);
    }
    return res;
}, new Set())];

for (let file of relevantFiles) {

    const destination = '../relevant-files/';

    if (!fs.existsSync(destination)) fs.mkdirSync(destination);

    const data = file.split('/');
    const fileName = data[data.length - 1];
    fs.copyFileSync(path.resolve('../../', file), path.resolve(destination, fileName));
}

console.log(relevantFiles);

console.log('OK');