"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("./Utils");
const ts = __importStar(require("typescript"));
const path_1 = __importDefault(require("path"));
class TranspilerFacade {
    constructor(sourcePath, destPath, environment) {
        this.sourcePath = (0, Utils_1.requireNotNull)(sourcePath, "sourcePath");
        this.destPath = (0, Utils_1.requireNotNull)(destPath, "destPath");
        this.environment = (0, Utils_1.requireNotNull)(environment, "environment");
    }
    compile() {
        const resourcePath = path_1.default.resolve(this.environment.getAppRootPath(), "resources");
        const nodeModulesPath = path_1.default.resolve(this.environment.getRootPath(), "node_modules");
        const typescriptPath = path_1.default.resolve(resourcePath, "typescript");
        const typesPath = path_1.default.resolve(typescriptPath, "types");
        const localTypesPath = path_1.default.resolve(nodeModulesPath, "@types");
        console.log("Compiling from: " + this.sourcePath);
        console.log("Compiling to: " + this.destPath);
        console.log("Types Path: " + typesPath);
        const indexFile = path_1.default.resolve(this.sourcePath, "index.ts");
        const typeRoots = [localTypesPath, typesPath];
        const options = {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
            declaration: true,
            resolveJsonModule: true,
            esModuleInterop: true,
            baseUrl: this.environment.getRootPath(),
            outDir: this.destPath,
            typeRoots: typeRoots,
            paths: {
                "*": [typesPath + "/*"]
            }
        };
        console.log(options);
        this.transpile([indexFile], options);
    }
    transpile(fileNames, options) {
        const program = ts.createProgram(fileNames, options);
        const emitResult = program.emit();
        const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
        allDiagnostics.forEach(diagnostic => {
            if (diagnostic.file) {
                const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
                const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
                console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
            }
            else {
                console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
            }
        });
        const exitCode = emitResult.emitSkipped ? 1 : 0;
        console.log(`Process exiting with code '${exitCode}'.`);
        process.exit(exitCode);
    }
}
exports.default = TranspilerFacade;
