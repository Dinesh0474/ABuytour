
const Pool = require('pg').Pool;

const pool = new Pool({
    user:"postgres",
    host:"localhost",
    port: 5432,
    password:"root",
    database:"of"
})
module.exports = pool;