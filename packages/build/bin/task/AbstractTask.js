"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../Utils");
const OutputImpl_1 = __importDefault(require("../OutputImpl"));
const fs_1 = __importDefault(require("fs"));
class AbstractTask {
    constructor(name) {
        this.name = (0, Utils_1.requireNotNull)(name, "name");
        this.output = new OutputImpl_1.default();
    }
    separator() {
        this.output.separator();
    }
    blankLine() {
        this.output.blankLine();
    }
    print(text) {
        this.output.print(text);
    }
    getConfig() {
        return this.config;
    }
    setConfig(config) {
        this.config = (0, Utils_1.requireNotNull)(config, "config");
    }
    run() {
        this.separator();
        this.print(this.name + " task - Started");
        this.separator();
        this.blankLine();
        this.initialize();
        this.execute();
        this.blankLine();
        this.separator();
        this.print(this.name + " task - Complete");
        this.separator();
    }
    execute() {
        // Intentionally do nothing by default
    }
    getTaskConfig() {
        return this.config.getTask(this.name);
    }
    initialize() {
        fs_1.default.mkdirSync(this.getConfig().getCommon().getWorkPath(), { recursive: true });
        fs_1.default.mkdirSync(this.getConfig().getCommon().getDistPath(), { recursive: true });
        // TODO - Implement
    }
}
exports.default = AbstractTask;
