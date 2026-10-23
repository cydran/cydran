/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Predicate } from "interface/Predicate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TAUTOLOGY_PREDICATE: Predicate<unknown> = (internals: unknown) => true;

export default TAUTOLOGY_PREDICATE;
