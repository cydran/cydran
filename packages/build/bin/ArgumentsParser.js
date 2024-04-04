"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("./Utils");
const DEFAULT_TASK_NAME = "help";
class ArgumentsParser {
    constructor(args) {
        this.arguments = (0, Utils_1.requireNotNull)(args, "args");
        this.taskName = this.arguments.length == 3 ? this.arguments[2] : DEFAULT_TASK_NAME;
    }
    getTaskName() {
        return this.taskName;
    }
    getArguments() {
        return this.arguments;
    }
}
exports.default = ArgumentsParser;
