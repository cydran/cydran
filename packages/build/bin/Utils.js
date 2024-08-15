"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadJson = exports.overlay = exports.merge = exports.isDefined = exports.requireNotNull = void 0;
const fs_1 = __importDefault(require("fs"));
function requireNotNull(value, name) {
    if (value === null || value === undefined) {
        throw new Error(name + " shall not be null");
    }
    return value;
}
exports.requireNotNull = requireNotNull;
function isDefined(value) {
    return value !== null && value !== undefined;
}
exports.isDefined = isDefined;
function merge(sources) {
    requireNotNull(sources, "sources");
    return overlay({}, sources);
}
exports.merge = merge;
function overlay(target, sources) {
    requireNotNull(target, "target");
    requireNotNull(sources, "sources");
    for (const source of sources) {
        if (!isDefined(source)) {
            continue;
        }
        for (const name in source) {
            if (!source.hasOwnProperty(name)) {
                continue;
            }
            if (!isDefined(source[name])) {
                continue;
            }
            target[name] = source[name];
        }
    }
    return target;
}
exports.overlay = overlay;
function loadJson(filePath) {
    const json = fs_1.default.readFileSync(filePath);
    const object = JSON.parse(json + '');
    return object;
}
exports.loadJson = loadJson;
