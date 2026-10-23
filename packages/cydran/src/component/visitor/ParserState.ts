/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

enum ParserState {
	OUTSIDE = 0,
	INSIDE_CURLY = 1,
	INSIDE_SQUARE = 2
}

export default ParserState;
