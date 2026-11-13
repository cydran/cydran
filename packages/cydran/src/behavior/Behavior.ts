/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Tellable from "interface/ables/Tellable";
import DigestableSource from "behavior/DigestableSource";
import Messagable from "interface/ables/Messagable";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Behavior<M, E extends HTMLElement | Text, P> extends DigestableSource, Tellable, Messagable {

	requestDigestionSources(sources: DigestableSource[]): void;

	onInit(dependencies?: unknown): void;

	onMount(): void;

	onUnmount(): void;

	onRemount(): void;

	isFlagged(name: string): boolean;

}

export default Behavior;
