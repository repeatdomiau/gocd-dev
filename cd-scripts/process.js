
const changesFile = process.argv[2];
const trace = x => { console.log(x); return x; }

if (changesFile) {
    require('fs')
        .promises
        .readFile(changesFile)
        .then(trace)
        .then(content => content.toString().split('\n'))
        .then(console.log);
}