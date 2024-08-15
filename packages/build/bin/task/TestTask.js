"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractTask_1 = __importDefault(require("./AbstractTask"));
const jest_cli_1 = require("jest-cli");
class TestTask extends AbstractTask_1.default {
    constructor() {
        super("Test");
    }
    execute() {
        console.log("test Task run");
        // Sync object
        const config = {
            clearMocks: true,
            // collectCoverage: process.env.cover ? !!process.env.cover : false,
            // coverageDirectory: "coverage",
            rootDir: this.getConfig().getEnvironment().getRootPath(),
            roots: [
                "./test"
            ],
            moduleDirectories: [
                "./dist",
                "./src",
                "./node_modules"
            ],
            passWithNoTests: true,
            testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
            // verbose: true,
            testEnvironment: "jsdom",
            // setupFilesAfterEnv: ['./conf/jest.setup.js']
        };
        (0, jest_cli_1.run)(["--config", JSON.stringify(config)], this.getConfig().getEnvironment().getRootPath());
        // if (result.results.success) {
        // 	console.log(`Tests completed`);
        // } else {
        // 	console.error(`Tests failed`);
        // }
    }
}
exports.default = TestTask;
