const mongoose = require('mongoose');

const UserModel = mongoose.model("User", new mongoose.Schema({ name: String, permissions: [String], password: String, access: [String] }));

class User {

    static find(username, password) {
        const doc = !!username && !!password ? await UserModel.findOne({ name: username, password: password }).exec() : null;
        return new User(doc);
    }

    constructor(doc, password = "none") {
        let name;
        if (typeof doc === "string") { name = doc; doc = null; }
        this.doc = doc || new UserModel({ name: name, password: password, permissions: [], access: [] });
        /** @type {string[]}  */
        this.permissions = doc.get('permissions');

        this.permissions.push("basics.*");
    }

    hasPermission(category, endpoint) {
        return this.permissions.includes("*") ||
            this.permissions.includes(category + ".*") ||
            this.permissions.includes(category + "." + endpoint);
    }

}

module.exports.User = User;