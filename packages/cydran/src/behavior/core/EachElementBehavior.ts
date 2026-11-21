/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import EachBehavior from "behavior/core/EachBehavior";
import EachConfig from "behavior/core/each/EachConfig";
import EachConfigImpl from "behavior/core/each/EachConfigImpl";
import EachPlacement from "behavior/core/each/EachPlacement";
import MarkerPlacement from "behavior/core/each/MarkerPlacement";
import DomUtils from "dom/DomUtils";
import { TagNames } from "CydranConstants";

const TOP_COMMENT_TEXT: string = "ES";
const BOTTOM_COMMENT_TEXT: string = "EE";

/**
 * The <c-each> element. It lists items exactly like the c-each attribute, with two differences: its settings are read
 * without a prefix (mode, idkey, expression), and its items render between two comment markers that take the
 * element's place.
 */
class EachElementBehavior extends EachBehavior {

	constructor() {
		super();
		this.setPrefixed(false);
	}

	protected createPlacement(): EachPlacement {
		const element: HTMLElement = this.getEl();
		const top: Comment = DomUtils.createComment(TOP_COMMENT_TEXT);
		const bottom: Comment = DomUtils.createComment(BOTTOM_COMMENT_TEXT);
		const parent: Node = element.parentNode;
		parent.replaceChild(bottom, element);
		parent.insertBefore(top, bottom);

		return new MarkerPlacement(top, bottom);
	}

	protected createConfig(): EachConfig {
		const subject: string = `<${TagNames.CYDRAN_EACH}> element`;
		const location: string = `inside a <${TagNames.CYDRAN_EACH}> element`;

		return new EachConfigImpl(this.getExpression(), this.getPrefix(), this.getBehaviorPrefix(), subject, location);
	}

}

export default EachElementBehavior;
