"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const EnvironmentImpl_1 = __importDefault(require("../EnvironmentImpl"));
const Config_1 = __importDefault(require("../Config"));
const CommonImpl_1 = __importDefault(require("./CommonImpl"));
const default_config_json_1 = __importDefault(require("../default-config.json"));
const Utils_1 = require("../Utils");
class ConfigFactory {
    constructor(appRootPath) {
        this.appRootPath = (0, Utils_1.requireNotNull)(appRootPath, "appRootPath");
    }
    create() {
        const resolver = (rootPath, childPath) => path_1.default.resolve(rootPath, childPath);
        const environment = new EnvironmentImpl_1.default(this.appRootPath);
        const packageJsonPath = path_1.default.resolve(environment.getRootPath(), "package.json");
        const packageJson = (0, Utils_1.loadJson)(packageJsonPath);
        const packageJsonConfig = packageJson["cydran-build"];
        const raw = (0, Utils_1.merge)([default_config_json_1.default, packageJsonConfig]);
        const common = new CommonImpl_1.default(environment, resolver, raw["common"]);
        const config = new Config_1.default(environment, common, raw);
        return config;
    }
    loadConfig() {
    }
}
exports.default = ConfigFactory;
