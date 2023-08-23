var sql = require('mssql');

var connection = new sql.ConnectionPool({
    user: "username",
    password: "password",
    server: "IP Server",
    database: "Name Database",
    "options": {
        "encrypt": true,
        "enableArithAbort": true
    }
});

module.exports = connection;