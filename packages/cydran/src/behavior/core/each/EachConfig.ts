/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

interface EachConfig {

	getExpression(): string;

	getBehaviorPrefix(): string;

	getPrefix(): string;

	/**
	 * Names where the list is declared, as the subject of a validation message, e.g. "Element with attribute c-each".
	 */
	getSubject(): string;

	/**
	 * Says where slot content was found, completing a validation message, e.g. "inside a <c-each> element".
	 */
	getLocation(): string;

}

export default EachConfig;
