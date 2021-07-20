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
});

app.use(async (req, res, next) => {
    console.log(req.method, req.url);

    const authorization = req.headers.authorization;
    const authorizationType = authorization?.split(" ");

    let username, password;
    if (authorizationType == "Basic") {
        const split = Buffer.from(authorization.split(" "), "base64").toString().split(":");
        username = split[0];
        password = split[1];
        console.log(split);
    }

    console.log(authorization, authorizationType, username, password)
    
    req.user = await User.find(username, password);

    next();
});
app.use(express.static(path.join(__dirname, 'public'), { extensions: [ "html", "js", "css" ] }));

app.get("/api/:category/:endpoint", async (req, res) => {
    const category = req.params.category;
    const endpoint = req.params.endpoint;
    /** @type {User} */
    const user = req.user;

    console.log(user.name, user.permissions);

    if (!user.hasPermission(category, endpoint)) {
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