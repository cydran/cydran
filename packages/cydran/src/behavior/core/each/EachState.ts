/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import DigestableSource from "behavior/DigestableSource";
import SimpleMap from "interface/SimpleMap";
import Alternative from 'behavior/core/each/Alternative';
import ComponentFactory from "component/ComponentFactory";
import ScopeImpl from "scope/ScopeImpl";
import { Nestable } from "context/Context";

interface EachState {

	getIds(): string[];

	setIds(ids: string[]): void;

	getMap(): SimpleMap<Nestable>;

	setMap(map: SimpleMap<Nestable>): void;

	getItemFactory(): ComponentFactory;

	setItemFactory(itemFactory: ComponentFactory): void;

	getEmpty(): Nestable;

	setEmpty(empty: Nestable): void;

	getFirst(): Nestable;

	setFirst(first: Nestable): void;

	getLast(): Nestable;

	setLast(last: Nestable): void;

	getLocalScope(): ScopeImpl;

	setLocalScope(localScope: ScopeImpl): void;

	addAlternative(alternative: Alternative): void;

	findFactory(): ComponentFactory;

	requestDigestionSources(sources: DigestableSource[]): void;

	tellChildren(name: string, payload?: unknown): void;

}

export default EachState;
