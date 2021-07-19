const https = require('https');
const http = require('http');
const mongoose = require('mongoose');
const sslChecker = require('ssl-checker');

/** @type {{[key: string]: category}} */
const endpoints = {};
const db = mongoose.connection;

endpoint("basics", "notfound", async (req, write) => {
    write("code", 404);
    write("message", "Not Found");
}, "Not found");

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

    const socketIo = await new Promise(resolve => {
        http.get({ hostname: "127.0.0.1", port: process.env.PORT || 200, path: "/testfile.txt" }, res => {
            resolve(res.statusMessage);
        }).on('error', err => {
            console.log(err);
            resolve("Unjoinable");
        });
    });

    const mongodb = [ "DISCONECTED", "CONNECTED", "CONNECTING", "DISCONNECTING" ][db.readyState];

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
    write("socketio", socketIo);
    write("mongodb", mongodb);
    write("interface", interface);
    write("domain", domain);
    write("ssl", ssl);
}, "Get service status");

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