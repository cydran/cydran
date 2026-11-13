/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

interface ArgumentsResolvers {

	resolve(context: unknown, instanceArguments: unknown[]): unknown[];

	postProcess(context: unknown, targetObject: unknown, params: unknown[]): void;

}

export default ArgumentsResolvers;
