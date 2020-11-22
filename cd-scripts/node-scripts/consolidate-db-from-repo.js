const fs = require('fs');
require('dotenv').config();
const mongoose = require('mongoose');

const trace = x => { console.log(x); return x; }
const toString = obj => obj.toString();
const split = sep => text => text.split(sep);
const splitLines = split('\n');
const filter = fn => arr => arr.filter(fn);
const byTruthy = x => x;
const arrayToSet = arr => new Set(arr);
const setToArray = set => [...set];


const db_host = process.env.MONGODB_HOST_NAME;
const db_user = process.env.MONGODB_USER;
const db_pass = process.env.MONGODB_PASSWORD;
const db_base = process.env.MONGODB_DATABASE;
const db_port = process.env.MONGODB_PORT;

const run = async () => {
    const changesFile = process.argv[2];

    if (changesFile) {
        await require('fs')
            .promises
            .readFile(changesFile)
            .then(toString)
            .then(splitLines)
            .then(filter(byTruthy))
            .then(trace)
            .catch(console.error);
    }

}

run();