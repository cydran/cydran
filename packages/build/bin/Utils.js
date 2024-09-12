"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireNotNull = requireNotNull;
exports.isDefined = isDefined;
exports.merge = merge;
exports.overlay = overlay;
exports.loadJson = loadJson;
const fs_1 = __importDefault(require("fs"));
function requireNotNull(value, name) {
    if (value === null || value === undefined) {
        throw new Error(name + " shall not be null");
    }
    return value;
}
function isDefined(value) {
    return value !== null && value !== undefined;
}
function merge(sources) {
    requireNotNull(sources, "sources");
    return overlay({}, sources);
}
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
function loadJson(filePath) {
    const json = fs_1.default.readFileSync(filePath);
    const object = JSON.parse(json + '');
    return object;
}
