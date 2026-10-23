/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

interface Attributes {

	extract(element: HTMLElement, name: string): string;

	remove(element: HTMLElement, name: string): void;

	isEventAttribute(name: string): boolean;

	isBehaviorAttribute(name: string): boolean;

	extractEventName(name: string): string;

	extractBehaviorName(name: string): string;

	asTypePrefix(name: string): string;

	getPrefix(): string;

}

export default Attributes;
