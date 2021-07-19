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

    const api = true;

    const socketIo = await new Promise(resolve => {
        http.request({ hostname: "127.0.0.1", port: process.env.PORT || 200, path: "/testfile.txt", method: "HEAD", protocol: "http:" }, res => {
            resolve(res.statusCode == 200);
        }).on('error', err => {
            console.log(err);
            resolve(false);
        });
    });

    const mongodb = db.readyState == 1;

    const interface = await new Promise(resolve => {
        http.request({ hostname: "127.0.0.1", port: process.env.PORT || 200, path: "/testfile.txt", method: "HEAD", protocol: "http:" }, res => {
            resolve(res.statusCode == 200);
        }).on('error', err => {
            console.log(err);
            resolve(false);
        });
    });

    const domain = await new Promise(resolve => {
        https.request({ hostname: "vps.galitan.tk", path: "/testfile.txt", method: "HEAD", protocol: "https:" }, res => {
            console.log(res.statusCode, res.statusMessage)
            resolve(res.statusCode == 200);
        }).on('error', err => {
            console.log(err);
            resolve(false);
        });
    });

    const ssl = (await sslChecker("vps.galitan.tk")).valid;

    write("api", api ? "OK" : "DEAD");
    write("socketio", socketIo ? "OK" : "DEAD");
    write("mongodb", mongodb ? "OK" : "DEAD");
    write("interface", interface ? "OK" : "DEAD");
    write("domain", domain ? "OK" : "DEAD");
    write("ssl", ssl ? "OK" : "DEAD");
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