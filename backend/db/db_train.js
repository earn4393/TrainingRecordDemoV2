var sql = require('mssql');

var connection = new sql.ConnectionPool({
    user: "username",
    password: "password",
    server: "server IP",
    database: "name database",
    "options": {
        "encrypt": true,
        "enableArithAbort": true
    }
});

module.exports = connection;
