/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import ContextAware from "awareness/ContextAware";
import { Context } from "context/Context";
import PostProcessor from "registry/postprocessor/PostProcessor";
import { hasMethod, isDefined } from "util/Utils";

class ContextAwarePostProcessor implements PostProcessor<unknown> {

	public postProcess(context: Context, instance: unknown) {

		if (isDefined(instance) && hasMethod(instance, "setContext")) {
			(instance as ContextAware).setContext(context);
		}
	}

}

export default ContextAwarePostProcessor;
