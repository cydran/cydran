/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

// jsdom, which @cydran/testsupport loads, needs TextEncoder and TextDecoder, which Jest's jsdom environment doesn't
// provide. @cydran/build's test task sets them the same way for the CommonJS suites.
const { TextEncoder, TextDecoder } = require("util");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
