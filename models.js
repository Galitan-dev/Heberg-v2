const mongoose = require('mongoose');

module.exports = {
    User: model("User", { name: String, permissions: [String], password: String, access: [String] })
};

/**
 * @param {string} name 
 * @param {object} definition
 * @return {mongoose.Model}
 */
function model(name, definition) {
   return mongoose.model(name, new mongoose.Schema(definition))
}