/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { msg } from "behavior/core/each/Bundle";

test("msg", () => {
	expect(msg("only-one-message", "c", "-", "item")).toEqual('must have only one child <template c-type="item"> node/element.');
});
