"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("./Utils");
class EnvironmentImpl {
    constructor(appRootPath) {
        this.appRootPath = (0, Utils_1.requireNotNull)(appRootPath, "appRootPath");
        this.rootPath = process.cwd();
    }
    getRootPath() {
        return this.rootPath;
    }
    getAppRootPath() {
        return this.appRootPath;
    }
}
exports.default = EnvironmentImpl;
