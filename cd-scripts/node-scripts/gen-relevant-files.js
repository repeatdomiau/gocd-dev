const fs = require('fs');
const path = require('path');

const compose = (...fns) => (...args) => fns.reduce((res, fn) => [fn.call(null, ...res)], args)[0];
const toString = obj => obj.toString();
const split = sep => text => text.split(sep);
const splitLines = split('\n');

const changesFile = process.argv[2];

const readLines = compose(fs.readFileSync, toString, splitLines);
const changes = readLines(changesFile);
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

const destination = '../relevant-files/';

if (!fs.existsSync(destination)) fs.mkdirSync(destination);
else {
    fs.rmdirSync(destination, { recursive: true });
    fs.mkdirSync(destination);
}

for (let file of relevantFiles) {
    const data = file.split('/');
    const fileName = data[data.length - 1];
    fs.copyFileSync(path.resolve('../../', file), path.resolve(destination, fileName));
}

console.log(relevantFiles);

console.log('OK');