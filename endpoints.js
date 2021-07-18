const http = require('http');

/** @type {{[key: string]: category}} */
const endpoints = {}

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
        http.get(`https://127.0.0.1:${process.env.PORT || 200}/socket.io/socket.io.js`, res => {
            resolve(res.statusCode == 200);
        });
    });

    const mongodb = false;

    write("api", api ? "OK" : "DEAD");
    write("socketio", socketIo ? "OK" : "DEAD");
    write("mongodb", mongodb ? "OK" : "DEAD");
});

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