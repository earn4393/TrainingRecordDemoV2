// เชื่อมต่อฐานข้อมูล
var sql = require('mssql');

var connection = new sql.ConnectionPool({
    // user: "username",
    // password: "password",
    // server: "server IP",
    // database: "name database",
    user: "traindb",
    password: "St@nley",
    server: "10.201.128.66\\TRAININGDB",
    database: "TrainDB",
    "options": {
        "encrypt": true,
        "enableArithAbort": true
    }
});

module.exports = connection;
