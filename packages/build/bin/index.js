#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const StartTask_1 = __importDefault(require("./task/StartTask"));
const HelpTask_1 = __importDefault(require("./task/HelpTask"));
const EjectTask_1 = __importDefault(require("./task/EjectTask"));
const CleanTask_1 = __importDefault(require("./task/CleanTask"));
const TestTask_1 = __importDefault(require("./task/TestTask"));
const BuildTask_1 = __importDefault(require("./task/BuildTask"));
const TaskExecutor_1 = __importDefault(require("./TaskExecutor"));
const ArgumentsParser_1 = __importDefault(require("./ArgumentsParser"));
const ConfigFactory_1 = __importDefault(require("./config/ConfigFactory"));
const appRootPath = path_1.default.resolve(__dirname, "..");
const executor = new TaskExecutor_1.default(HelpTask_1.default);
executor.register("start", StartTask_1.default);
executor.register("build", BuildTask_1.default);
executor.register("clean", CleanTask_1.default);
executor.register("test", TestTask_1.default);
executor.register("eject", EjectTask_1.default);
executor.register("help", HelpTask_1.default);
const parser = new ArgumentsParser_1.default(process.argv);
const configFactory = new ConfigFactory_1.default(appRootPath);
const config = configFactory.create();
const taskName = parser.getTaskName();
executor.execute(taskName, config);
