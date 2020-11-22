const fs = require('fs');
require('dotenv').config();
const mongoose = require('mongoose');


const changesFile = process.argv[2];
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


if (changesFile) {
    require('fs')
        .promises
        .readFile(changesFile)
        .then(toString)
        .then(splitLines)
        .then(filter(byTruthy))
        .then(arrayToSet)
        .then(setToArray)
        .then(files => {

            const db = mongoose.createConnection(`mongodb://${db_user}:${db_pass}@${db_host}:${db_port}`, { useUnifiedTopology: true, useNewUrlParser: true });
            db.once('open', () => {
                db.useDb(db_base);
                db.close();
            })

        }).catch(console.error);
}