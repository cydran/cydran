"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OutputImpl {
    separator() {
        console.log("------------------------------------------------------------------------------");
    }
    blankLine() {
        console.log();
    }
    print(text) {
        console.log(text);
    }
}
exports.default = OutputImpl;
