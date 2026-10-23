/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import DomWalkerImpl from "component/DomWalkerImpl";
import ComponentInternals from "component/ComponentInternals";
import NonOpVisitor from "component/visitor/NonOpVisitor";
import ComponentStylesVisitor from "component/visitor/ComponentStylesVisitor";
import RegionVisitor from 'component/visitor/RegionVisitor';
import OtherVisitor from "component/visitor/OtherVisitor";
import TextVisitor from "component/visitor/TextVisitor";
import SeriesVisitor from "component/visitor/SeriesVisitor";
import { TagNames } from "CydranConstants";

class MvvmDomWalkerImpl extends DomWalkerImpl<ComponentInternals> {

	constructor(textVisitor: TextVisitor, otherVisitor: OtherVisitor) {
		super(otherVisitor, textVisitor, new NonOpVisitor());
		this.addVisitor(TagNames.CYDRAN_COMPONENT_STYLES, new ComponentStylesVisitor());
		this.addVisitor(TagNames.CYDRAN_REGION, new RegionVisitor());
		this.addVisitor(TagNames.CYDRAN_SERIES, new SeriesVisitor());
	}

}

export default MvvmDomWalkerImpl;
