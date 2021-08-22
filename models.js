const Docker = require('dockerode');
const mongoose = require('mongoose');

const UserModel = mongoose.model("User", new mongoose.Schema({ name: String, permissions: [String], password: String, access: [String] }));

class User {

    static async find(username, password) {
        const doc = !!username && !!password ? await UserModel.findOne({ name: username, password: password }).exec() : null;
        return new User(doc);
    }

    constructor(doc) {
        this.doc = doc || new UserModel({ name: "public", password: "none", permissions: [], access: [] });
        /** @type {string[]}  */
        this.permissions = this.doc.get('permissions');

        this.permissions.push("basics.*");
        if (this.name == "public") this.permissions.push("!basics.status");
    }

    get name() {
        return this.doc.get('name');
    }

    hasPermission(category, endpoint) {
        return this.permissions.includes("*") 
        ||( this.permissions.includes(category + ".*")
        ||  this.permissions.includes(category + "." + endpoint))
        &&! this.permissions.includes("!" + category + ".*")
        &&! this.permissions.includes("!" + category + "." + endpoint);
    }

}

const lowerString = { type: String, lowercase: true };

const TokenModel = mongoose.model("Token", new mongoose.Schema({ user: lowerString , value: String }));

const HebergModel = mongoose.model("Heberg", new mongoose.Schema({
    name: lowerString,
    repository: { 
        user: lowerString, 
        name: lowerString
    },
    env: {
        type: Map,
        of: String
    },
    directory: String,
    containerId: { type: String },
    autoDeploy: { type: Boolean, default: false }
}));

class Heberg {
    static docker = new Docker({ socketPath: "/var/run/docker.sock", version: "v1.41" });

    static async ping() {
        return Heberg.docker.ping();
    }

    static async get(name) {
        const doc = await HebergModel.findOne({ name: name }).exec();
        if (!doc) return null;
        console.log(doc)
        return new Heberg(doc);
    }

    static async create(def) {
        return new Heberg(await HebergModel.create(def));
    }

    /** @param {mongoose.Document} doc */
    constructor(doc) {
        /** @type {mongoose.Document} */
        this.doc = doc;
    }

    get name() {
        return this.doc.get("name");
    }

    /** @returns {{ user: String, name: String, full: String }} */
    get repository() {
        const repository = this.doc.get("repository");
        return {
            user: repository.user,
            name: repository.name,
            full: repository.user + "/" + repository.name
        }
    }

    /** @param {String} full @returns {Promise<void>} */
    set repository(full) {
        const split = full.split("/");
        this.doc.set("repository.user", split[0]);
        this.doc.set("repository.name", split[1]);
        return this.doc.save();
    }

    /** @returns {Map<String, String>} */
    get env() {
        return this.doc.get("env");
    }

    /** @param {Map<String, String>} env @returns {Promise<void>} */
    set env(env) {
        this.doc.set("env", env);
        return this.doc.save();
    }

    /**
     * @param {String} key 
     * @param {String} value
     * @returns {Promise<void>}
     */
    setEnvironmentVariable(key, value) {
        return this.env = this.env.set(key, value);
    }

    /** @param {String} key @returns {Promise<void>} */
    removeEnvironmentVariable(key) {
        return this.env = this.env.remove(key);
    }

    /**
     * @param {String} key 
     * @returns {String}
     */
    getEnvironmentVariable(key) {
        return this.env.get(key);
    }

    /** @param {boolean} autoDeploy @returns {Promise<void>} */
    set autoDeploy(autoDeploy) {
        this.doc.set("autoDeploy", autoDeploy);
        return this.doc.save();
    }

    /** @returns {Docker.Container} */
    get container() {
        const containerId = this.doc.get("containerId");
        if (!containerId) return null;
        return Heberg.docker.getContainer(containerId);
    }

    /** @returns {boolean} */
    get autoDeploy() {
        return this.doc.get("autoDeploy");
    }

    /** @param {Docker.Container} container @returns {Promise<void>} */
    set container(container) {
        this.doc.set("containerId", container.id);
        return this.doc.save();
    }

    /** @returns {String} */
    get directory() {
        return this.doc.get("directory");
    }

    /** @param {directory} directory @returns {Promise<void>} */
    set directory(directory) {
        this.doc.set("directory", directory);
        return this.doc.save();
    }

}

module.exports.UserModel = UserModel;
module.exports.User = User;

module.exports.TokenModel = TokenModel;

module.exports.HebergModel = HebergModel;
module.exports.Heberg = Heberg;