const mysql = require('mysql2');
const data = require('./private.json');


let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: data.password,
    database: 'epichessdb'
  });

module.exports = {
  con
}