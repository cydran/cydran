/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import ArgumentsResolversBuilderImpl from 'argument/ArgumentResolversBuilderImpl';
import ArgumentsResolversBuilder from "stage/ArgumentsResolversBuilder";

function argumentsBuilder(): ArgumentsResolversBuilder {
	return new ArgumentsResolversBuilderImpl();
}

export default argumentsBuilder;
