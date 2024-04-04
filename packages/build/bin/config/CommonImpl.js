"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommonImpl {
    constructor(environment, resolver, raw) {
        this.distPath = resolver(environment.getRootPath(), raw["distDirectory"]);
        this.staticPath = resolver(environment.getRootPath(), raw["staticDirectory"]);
        this.workPath = resolver(environment.getRootPath(), raw["workDirectory"]);
        this.srcPath = resolver(environment.getRootPath(), raw["srcDirectory"]);
        this.testPath = resolver(environment.getRootPath(), raw["testDirectory"]);
    }
    getDistPath() {
        return this.distPath;
    }
    getStaticPath() {
        return this.staticPath;
    }
    getWorkPath() {
        return this.workPath;
    }
    getSrcPath() {
        return this.srcPath;
    }
    getTestPath() {
        return this.testPath;
    }
}
exports.default = CommonImpl;
