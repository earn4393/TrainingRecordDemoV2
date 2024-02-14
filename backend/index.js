const express = require('express');
const app = express();
const port = process.env.PORT || 3331;

const callRoutesTrain = require('./routes/services2.js')

app.use(express.json());
app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:3006'];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true')
    next()
})


app.use('/service2', callRoutesTrain)

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
