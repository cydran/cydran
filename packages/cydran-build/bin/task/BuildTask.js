"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractTask_1 = __importDefault(require("./AbstractTask"));
const TranspilerFacade_1 = __importDefault(require("../TranspilerFacade"));
const path_1 = __importDefault(require("path"));
class BuildTask extends AbstractTask_1.default {
    constructor() {
        super("Build");
    }
    execute() {
        this.jsPath = path_1.default.resolve(this.getConfig().getCommon().getWorkPath(), "js");
        this.compile();
        this.aggregate();
        this.minify();
        this.copyResources();
    }
    compile() {
        this.print("== Compiling Source Files ====================================================");
        const compiler = new TranspilerFacade_1.default(this.getConfig().getCommon().getSrcPath(), this.jsPath, this.getConfig().getEnvironment());
        compiler.compile();
        this.blankLine();
    }
    aggregate() {
        this.print("== Aggregating ECMAScript ====================================================");
        this.blankLine();
    }
    minify() {
        this.print("== Minifying ECMAScript ======================================================");
        this.blankLine();
    }
    copyResources() {
        this.print("== Copying Resources =========================================================");
        this.blankLine();
    }
}
exports.default = BuildTask;
