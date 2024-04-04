"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("./Utils");
const sections = ["start", "build", "clean", "test", "eject", "help", "common"];
class Config {
    constructor(environment, common, raw) {
        this.environment = (0, Utils_1.requireNotNull)(environment, "environment");
        this.common = (0, Utils_1.requireNotNull)(common, "common");
        this.raw = (0, Utils_1.requireNotNull)(raw, "raw");
    }
    getEnvironment() {
        return this.environment;
    }
    getCommon() {
        return this.common;
    }
    getTask(name) {
        return this.raw[name];
    }
}
exports.default = Config;
