"use strict";
exports.__esModule = true;
var http_1 = require("http");
var port = 3000;
var receiveRequest = function (req, res) {
    res.setHeader("Set-Cookie", "name=value;Path=/;Secure;HttpOnly;");
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<h1>Hello World</h1>');
    res.end();
};
var server = http_1["default"].createServer(receiveRequest);
server.listen(3000);
