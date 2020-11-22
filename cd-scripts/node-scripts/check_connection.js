require('dotenv').config();
const mongoose = require('mongoose');

const db_host = process.env.MONGODB_HOST_NAME;
const db_user = process.env.MONGODB_USER;
const db_pass = process.env.MONGODB_PASSWORD;
const db_base = process.env.MONGODB_DATABASE;
const db_port = process.env.MONGODB_PORT;

try {
    const db = mongoose.createConnection(`mongodb://${db_user}:${db_pass}@${db_host}:${db_port}`, { useUnifiedTopology: true, useNewUrlParser: true });
    db.once('open', () => {
        db.useDb(db_base);
        db.close();
        console.log('OK');
    });

} catch (err) {
    console.error(err);
    throw 'FAILED';
}