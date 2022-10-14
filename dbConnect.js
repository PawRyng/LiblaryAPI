const config = require("./config.json") 
const mysql = require("mysql2")
exports.connection = mysql.createConnection({
        host: config.URL_DB,
        user: 'root',
        database: 'liblary'
      });
