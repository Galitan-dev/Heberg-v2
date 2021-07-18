const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
const http = require('http');
const endpoints = require('./endpoints')

const PORT = process.env.PORT || 200;

const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server); //TODO: implement sockets interaction

app.use(express.static(path.join(__dirname, 'public'), { extensions: [ "html", "js", "css" ] }));

app.get("/api/:category/:endpoint", async (req, res) => {
    const category = req.params.category;
    const endpoint = req.params.endpoint;

    const data = {
        code: 500
    }

    /** @type {import('./endpoints').writeFunc} */
    const write = (key, value) => data[key] = value;

    if (category in endpoints && endpoint in endpoints[category]) await endpoints[category][endpoint].execute(req, write);
    else await endpoints.basics.notfound.execute(req, write);

    res.writeHead(data.code, { 'Content-Type': 'application/json' });

    write("date", new Date());

    res.write(JSON.stringify(data));
    res.end();
});

server.listen(PORT, () => console.log("Server listening on port " + PORT));