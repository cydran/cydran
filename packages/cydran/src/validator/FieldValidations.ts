/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import SimpleMap from "interface/SimpleMap";

type FieldValidations<S> = SimpleMap<((field: unknown, instance: unknown, state: S) => string)[]>;

export default FieldValidations;
