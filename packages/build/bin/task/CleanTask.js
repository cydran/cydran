"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractTask_1 = __importDefault(require("./AbstractTask"));
const fs_1 = __importDefault(require("fs"));
class CleanTask extends AbstractTask_1.default {
    constructor() {
        super("Clean");
    }
    execute() {
        this.remove(this.getConfig().getCommon().getDistPath());
        this.remove(this.getConfig().getCommon().getWorkPath());
    }
    remove(path) {
        this.print("Removed: " + path);
        fs_1.default.rmSync(path, { recursive: true, force: true });
    }
}
exports.default = CleanTask;
