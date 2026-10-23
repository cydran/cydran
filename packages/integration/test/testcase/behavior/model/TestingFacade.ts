/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import { Harness, Operations } from "@cydran/testsupport";
import { expect } from '@jest/globals';

class TestingFacade<T extends Component> {

	private harness: Harness<T>;

	constructor(rootSupplier?: () => T) {
		expect(rootSupplier).not.toBeNull();
		this.harness = new Harness<T>(rootSupplier).start();
	}

	public verifyValueComponent(id: number, expected: string): void {
		this.harness.forTestId("display" + id).expect().textContent().toEqual(expected);
		expect((this.harness.getComponent() as Record<string, any>)["getValue" + id]()).toEqual(expected);
		expect(this.harness.forTestId("element" + id).get<HTMLInputElement>().value).toEqual(expected);
	}

	public verifyMultiselectComponent(id: number, expectedValue: string, expectedValues: string[]): void {
		this.harness.forTestId("display" + id).expect().textContent().toEqual(expectedValue);
		expect((this.harness.getComponent() as Record<string, any>)["getValue" + id]()).toEqual(expectedValues);
		this.harness.forTestId("element" + id).expect().selectedValues().toEqual(expectedValues);
	}

	public verifyRadioComponent(id: number, suffix: string, expectedValue: string, expectedCheckedState: boolean): void {
		this.harness.forTestId("display" + id).expect().textContent().toEqual(expectedValue);
		expect((this.harness.getComponent() as Record<string, any>)["getValue" + id]()).toEqual(expectedValue);
		expect(this.harness.forTestId("radio-" + suffix).get<HTMLInputElement>().checked).toEqual(expectedCheckedState);
	}

	public verifyCheckbox(id: number, expected: boolean): void {
		this.harness.forTestId("display" + id).expect().textContent().toEqual(expected + "");
		expect((this.harness.getComponent() as Record<string, any>)["getValue" + id]()).toEqual(expected);
		expect(this.harness.forTestId("element" + id).get<HTMLInputElement>().checked).toEqual(expected);
	}

	public updateCheckbox(id: number, value: boolean): void {
		this.harness.forTestId("element" + id).setCheckedState(value);
	}

	public updateValuedComponent(id: number, value: string): void {
		this.harness.forTestId("element" + id).replaceText(value);
	}

	public forTestId(value: string): Operations {
		return this.harness.forTestId(value);
	}

}

export default TestingFacade
