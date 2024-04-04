"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("./Utils");
class Environment {
    constructor(rootPath) {
        this.rootPath = (0, Utils_1.requireNotNull)(rootPath, "rootPath");
    }
    getRootPath() {
        return this.rootPath;
    }
}
exports.default = Environment;
