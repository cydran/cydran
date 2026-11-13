/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import FormOperations from "component/FormOperations";
import { FORM_KEY } from "CydranConstants";
import { requireNotNull } from 'util/Utils';

class FormOperationsImpl implements FormOperations {

	private form: HTMLFormElement;

	constructor(form: HTMLFormElement) {
		this.form = requireNotNull(form, FORM_KEY);
	}

	public submit(): void {
		this.form.submit();
	}

	public requestSubmit(): void {
		this.form.requestSubmit();
	}

	public reset(): void {
		this.form.reset();
	}

}

export default FormOperationsImpl;
