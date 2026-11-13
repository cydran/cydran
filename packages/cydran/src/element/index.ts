/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { isDefined } from "util/Utils";
import RegionElement from "element/RegionElement";
import ComponentStylesElement from "element/ComponentStylesElement";
import Type from "interface/Type";
import SeriesElement from "element/SeriesElement";

function register<T extends HTMLElement>(tag: string, elClass: Type<T>) {
	if (!isDefined(customElements.get(tag))) {
		customElements.define(tag, elClass);
	}
}

register("c-region", RegionElement);
register("c-component-styles", ComponentStylesElement);
register("c-series", SeriesElement);
