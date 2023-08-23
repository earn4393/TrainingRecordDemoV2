const express = require('express');
const app = express();
const port = process.env.PORT || 3333;

const callRoutesTrain = require('./routes/services2.js')

app.use(express.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next()
})


app.use('/service2', callRoutesTrain)

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
