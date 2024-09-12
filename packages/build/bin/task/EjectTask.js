"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractTask_1 = __importDefault(require("./AbstractTask"));
class EjectTask extends AbstractTask_1.default {
    constructor() {
        super("Eject");
    }
    execute() {
        console.log("Not yet implemented");
        // TODO - Implement
        // Copy cydran-build.js to [project]/scripts/cydran-build.js
        // Update scripts in package.json
        // Add dev dependencies
        // Run npm install
    }
}
exports.default = EjectTask;
