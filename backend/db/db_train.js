var sql = require('mssql');

var connection = new sql.ConnectionPool({
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