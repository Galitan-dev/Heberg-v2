const express = require('express');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const endpoints = require('./endpoints');
const { User } = require('./models');

const PORT = process.env.PORT || 200;

const app = express();
const server = http.createServer(app);
const jsonParser = bodyParser.json();

console.log("Connecting to Mongo database...");
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); 
const db = mongoose.connection;

db.on('error', console.error.bind(console, "MongoDB connection error:"));
db.once('open', async () => {
    console.log("Connected!");
});

app.use(async (req, res, next) => {

    const authorization = req.headers.authorization?.split(" ");
    const authorizationType = authorization ? authorization[0] : null || "Public";

    let username, password;
    if (authorizationType == "Basic")
        [ username, password ] = Buffer.from(authorization[1], "base64").toString().split(":");

    /** @type {User} */
    const user = req.user = await User.find(username, password);

    console.log(req.method, req.url, "From:", user.name, "With", user.permissions.join(", ").replace(/\*/g, "all").replace(/,\s([^,]+)$/, ' and $1'), "permissions");
    next();
});
app.use(express.static(path.join(__dirname, 'public'), { extensions: [ "html", "js", "css" ] }));

app.get("/api/:category/:endpoint", jsonParser,  async (req, res) => {
    const category = req.params.category;
    const endpoint = req.params.endpoint;
    /** @type {User} */
    const user = req.user;

    const data = {
        code: 500
    }

    /** @type {import('./endpoints').writeFunc} */
    const write = (key, value) => data[key] = value;

    if (!(category in endpoints && endpoint in endpoints[category])) await endpoints.basics.notfound.execute(req, write);
    else if (!user.hasPermission(category, endpoint)) await endpoints.basics.unauthorized.execute(req, write);
    else await endpoints[category][endpoint].execute(req, write);

    res.writeHead(data.code, { 'Content-Type': 'application/json' });

    write("date", new Date());

    res.write(JSON.stringify(data));
    res.end();
});

server.listen(PORT, () => console.log("Server listening on port " + PORT));