var cookieParser = require("cookie-parser");
var express = require("express");

var app = express();
app.use(cookieParser());

app.get('/', function (req, res) {
    if (!req.cookies) {
        req.cookie('show', "1", {maxAge: 60});
    }
    let count = parseInt(req.cookies['show']);
    count++;
    res.cookie('show', count);
    res.end(`
    <h1>Cookie counter</><br>
    <p>This page was loaded ${count} time(s) in last minute</p>
    `);
})

app.listen(8080);