/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import FormOperations from 'component/FormOperations';
import { requireNotNull } from 'util/Utils';

class MultipleFormOperationsImpl implements FormOperations {

	private forms: HTMLFormElement[];

	constructor(forms: HTMLFormElement[]) {
		this.forms = requireNotNull(forms, "forms");
	}

	public submit(): void {
		for (const form of this.forms) {
			form.submit();
		}
	}

	public requestSubmit(): void {
		for (const form of this.forms) {
			form.requestSubmit();
		}
	}

	public reset(): void {
		for (const form of this.forms) {
			form.reset();
		}
	}

}

export default MultipleFormOperationsImpl;
