const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
const http = require('http');
const endpoints = require('./endpoints')

const PORT = process.env.PORT || 200;

const app = express();
const server = http.createServer(app);
const io = socketIo(server); //TODO: implement sockets interaction

app.use(express.static(path.join(__dirname, 'public'), { extensions: [ "html", "js", "css" ] }));

app.get("/api/help", (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const data = {}

    /** @type {import('./endpoints').writeFunc} */
    const write = (key, value) => data[key] = value;
    
});

app.get("/api/:category/:command", (req, res) => {
    const category = req.params.category;
    const command = req.params.command;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    const data = {}

    /** @type {import('./endpoints').writeFunc} */
    const write = (key, value) => data[key] = value;

    if (category in endpoints) endpoints[category](req, command, write);
    else endpoints.notfound(req, command, write);

    write("date", Date.now());

    res.write(JSON.stringify(data));
    res.end();
});

server.listen(PORT, () => console.log("Server listening on port " + PORT));