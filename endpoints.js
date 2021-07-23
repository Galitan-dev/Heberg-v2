const https = require('https');
const http = require('http');
const mongoose = require('mongoose');
const sslChecker = require('ssl-checker');
const { TokenModel, Heberg } = require('./models');

/** @type {{[key: string]: category}} */
const endpoints = {};
const db = mongoose.connection;
const ConnectionStates = [ "DISCONNECTED", "CONNECTED", "CONNECTING", "DISCONNECTING" ];

endpoint("basics", "notfound", async (req, write) => {
    write("code", 404);
    write("message", "Not Found");
}, "Not found");

endpoint("basics", "unauthorized", async (req, write) => {
    write("code", 401);
    write("message", "Unauthorized");
}, "Unauthorized");

endpoint("basics", "help", async (req, write) => {
    write("code", 200);
    const endpointsData = {};
    for (const category of Object.values(endpoints)) {
        const categoryEndpoints = {};
        for (const endpoint of Object.values(endpoints[category.name])) {
            if (typeof endpoint === "string") continue;
            categoryEndpoints[endpoint.name] = endpoint.description;
        }

        endpointsData[category.name] = categoryEndpoints;
    }
    write("endpoints", endpointsData);
}, "List endpoints");

endpoint("basics", "status", async (req, write) => {
    write("code", 200);

    const api = "OK";

    const docker = (await Heberg.ping()) ? "CONNECTED" : "DISCONNECTED"; 

    const mongodb = ConnectionStates[db.readyState].toUpperCase();

    const interface = await new Promise(resolve => {
        http.get({ hostname: "127.0.0.1", port: process.env.PORT || 200, path: "/testfile.txt" }, res => {
            resolve(res.statusMessage);
        }).on('error', err => {
            console.log(err);
            resolve("Unjoinable");
        });
    });

    const domain = await new Promise(resolve => {
        https.get({ hostname: "vps.galitan.tk", path: "/testfile.txt" }, res => {
            resolve(res.statusMessage);
        }).on('error', err => {
            console.log(err);
            resolve("Unjoinable");
        });
    });

    const ssl = (await sslChecker("vps.galitan.tk")).valid ? "VALID" : "INVALID";

    write("api", api);
    write("docker", docker);
    write("mongodb", mongodb);
    write("interface", interface);
    write("domain", domain);
    write("ssl", ssl);
}, "Get service status");

endpoint("github", "listTokens", async (req, write) => {
    write("code", 200);

    const tokens = await TokenModel.find().exec();
    const obj = {};
    for (const token of tokens) {
        obj[token.user] = token.value;
    }

    write("tokens", obj);
}, "List available github tokens");

endpoint("github", "createToken", async (req, write) => {
    if (req.headers['content-type'] != "application/json" || !req.body) {
        write("code", 400);
        write("message", "Expected JSON body");
        return;
    }

    const user = req.body.user?.toLowerCase();
    const token = Buffer.from(req.body.token, "base64");

    if (!user || !token) {
        write("code", 400);
        write("message", "Expected user and token in JSON body");
        return;
    }

    if (token.toString("base64") != req.body.token) {
        write("code", 400);
        write("message", "Expected token to be base64 encoded");
        return;
    }

    if (await TokenModel.findOne({ user: user }).exec()) {
        write("code", 422);
        write("message", "This user already have a token");
        return;
    }

    const valid = await new Promise(resolve => {
        https.get({ hostname: 'api.github.com', path: '/user', headers: { 'Authorization': `Bearer ${token.toString()}`, "User-Agent": "request" } }, res => {
            resolve(res.statusCode == 200);
        }).on('error', err => {
            console.log(err);
            resolve(false);
        });
    });

    if (!valid) {
        write("code", 422);
        write("message", "Invalid token");
        return;
    }

    await TokenModel.create({ user: user, value: token.toString() });

    write("code", 200);
}, "Create a new github token");


module.exports = endpoints;

/**
 * @param {string} category 
 * @param {string} name 
 * @param {endpointFunc} execute 
 * @param {string} description 
 */
function endpoint(category, name, execute, description) {
    /** @type {endpoint} */
    const endpoint = {
        name: name,
        category: category,
        execute: execute,
        description: description
    };

    if (!(category in endpoints)) endpoints[category] = { name: category };
    endpoints[category][name] = endpoint;
}

/**
 * @typedef endpoint
 * @type {object}
 * @property {string} name
 * @property {string} category
 * @property {endpointFunc} execute
 * @property {string} description
 */

/**
 * @typedef category
 * @type {{[key: string]: endpoint}}
 * @property {string} name
 */

/**
 * @typedef endpointFunc
 * @type {(req: import('express').Request, write: writeFunc)) => void}
 */

/**
 * @typedef writeFunc
 * @type {(key: string, value: any) => void}
 */