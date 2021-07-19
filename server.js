const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');

const endpoints = require('./endpoints');
const { User } = require('./models');

const PORT = process.env.PORT || 200;

const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server); //TODO: implement sockets interaction

console.log("Connecting to Mongo database...");
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); 
const db = mongoose.connection;

db.on('error', console.error.bind(console, "MongoDB connection error:"));
db.once('open', async () => {
    console.log("Connected!");
    await User.create({ name: "admin", permissions: ["*"], password: "L3ae3RCZKZg5C#MU", access: ["*"] });
    console.log(await User.findOne().exec());
});

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});
app.use(express.static(path.join(__dirname, 'public'), { extensions: [ "html", "js", "css" ] }));

app.get("/api/:category/:endpoint", async (req, res) => {
    const category = req.params.category;
    const endpoint = req.params.endpoint;
    const username = req.headers.username;
    const password = req.headers.password;

    const user = await User.findOne({ username: username, password: password }, "permissions").exec();

    if (!user || (!user.permissions.includes["*"] && !user.permissions.includes(`${category}.${endpoint}`))) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        const data = {
            code: 401,
            message: "Unauthorized"
        }
        res.write(JSON.stringify(data));
        res.end();
        return;
    }

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