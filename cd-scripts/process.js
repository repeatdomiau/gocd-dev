
const changesFile = process.argv[2];

if (changesFile) {
    require('fs')
        .promises
        .readFile(changesFile)
        .then(content => content.split('\n'))
        .then(console.log);
}