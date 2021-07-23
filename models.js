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

const TokenModel = mongoose.model("Token", new mongoose.Schema({ user: { type: String, lowercase: true }, value: String }))

module.exports.UserModel = UserModel;
module.exports.User = User;

module.exports.TokenModel = TokenModel;