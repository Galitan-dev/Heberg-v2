const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 200;

const app = express();
const server = http.createServer(app);
const io = socketIo(server); //TODO: implement sockets interaction

app.use(express.static(path.join(__dirname, 'public'), { extensions: [ "html", "js", "css" ] }));

app.get("/api/:category/:command", (req, res) => {
    const category = req.params.category;
    const command = req.params.command;

    res.writeHead(200, { 'Content-Type': 'application/json' });

    const data = {
        code: 200,
        category: category,
        command: command,
        date: new Date()
    }

    res.write(JSON.stringify(data));
    res.end();
});

server.listen(PORT, () => console.log("Server listening on port " + PORT));