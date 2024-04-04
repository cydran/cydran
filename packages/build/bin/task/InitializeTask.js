"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractTask_1 = __importDefault(require("./AbstractTask"));
class InitializeTask extends AbstractTask_1.default {
    constructor() {
        super("Initialize");
    }
    execute() {
        console.log("Initialize Task run");
    }
}
exports.default = InitializeTask;
