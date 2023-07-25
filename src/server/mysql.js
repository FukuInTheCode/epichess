const mysql = require('mysql2');
const data = require('./private.json');


let con = mysql.createConnection({
    host: data.host,
    user: data.user,
    password: data.password,
    database: data.database
  });

module.exports = {
  con
}