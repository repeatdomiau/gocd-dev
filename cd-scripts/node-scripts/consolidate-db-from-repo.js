const fs = require('fs');
require('dotenv').config();
const mongoose = require('mongoose');

const compose = (...fns) => (...args) => fns.reduce((res, fn) => [fn.call(null, ...res)], args)[0];
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

const changesFile = process.argv[2];

const app = compose(toString, splitLines, filter(byTruthy), trace);

try {
    if (changesFile) {
        const content = require('fs').readFileSync(changesFile);
        app(content);
    }
}
catch (err) {
    console.log(err);
    throw 'failed';
}