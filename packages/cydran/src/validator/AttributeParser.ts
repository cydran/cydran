/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import AttributeParserConfig from 'validator/AttributeParserConfig';

interface AttributeParser<T> {

	parse(config: AttributeParserConfig<T>, element: HTMLElement, prefix: string, validate: boolean, tagText: string): T;

}

export default AttributeParser;
