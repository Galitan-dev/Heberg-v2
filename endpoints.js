/** @type {{[key: string]: category}} */
const endpoints = {}

endpoint("basics", "notfound", (req, write) => {
    write("code", 404);
    write("message", "Not Found");
});

endpoint("basics", "help", (req, write) => {
    write("code", 200);
    const endpointsData = {};
    for (const category of Object.values(endpoints)) {
        const categoryEndpoints = {};
        for (const endpoint of Object.values(endpoints[category])) {
            categoryEndpoints[endpoint.name] = endpoint.description;
        }

        endpointsData[category.name] = categoryEndpoints;
    }
    write("endpoints", endpointsData);
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