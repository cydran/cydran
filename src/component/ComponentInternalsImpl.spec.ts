import Component from "@/component/Component";
import { ComponentConfig, ComponentConfigImpl } from "@/component/ComponentConfig";
import ComponentInternalsImpl from "@/component/ComponentInternalsImpl";
import Logger from "@/logger/Logger";
import { assertNullGuarded } from "@/util/TestUtils";

import { assert } from "chai";
import { describe, it, xit } from "mocha";
import { instance, mock, spy, verify } from "ts-mockito";

describe("ComponentInternalsImpl tests", () => {
	const mockComponent: Component = instance(mock(Component));
	const cConfig: ComponentConfig = new ComponentConfigImpl();
	const template: string = "<div></div>";

	function getNewCII() {
		return new ComponentInternalsImpl(mockComponent, template, cConfig);
	}

	it("new ComponentInternalsImpl - null template", () => {
		assertNullGuarded("template", () => new ComponentInternalsImpl(mockComponent, null, cConfig));
	});

	it("new ComponentInternalsImpl() - normal", () => {
		const cii: ComponentInternalsImpl = getNewCII();
		assert.isNotNull(cii, "is null");
	});

	it("getLogger(): Logger", () => {
		const logr: Logger = getNewCII().getLogger();
		assert.isNotNull(logr, "is null");
	});

	it("set/get Data(data: any): void?|any", () => {
		const data = { name1: "bubba", name2: "sally" };
		const cii: ComponentInternalsImpl = getNewCII();
		const spyCii: ComponentInternalsImpl = spy(cii);
		const dataFn: () => any = () => data;
		cii.setItemFn(dataFn);
		verify(spyCii.setItemFn(dataFn)).once();
		assert.equal(data, cii.getData(), "data sets are not equal");
	});

	it("getExternalCache(): any", () => {
		const cii: ComponentInternalsImpl = getNewCII();
		const spyCii: ComponentInternalsImpl = spy(cii);
		const excache: any = cii.getExternalCache();
		verify(spyCii.getExternalCache()).once();
		assert.isNotNull(excache);
	});

	it("importExternals(): void", () => {
		const cii: ComponentInternalsImpl = getNewCII();
		const spyCii: ComponentInternalsImpl = spy(cii);
		cii.importExternals();
		verify(spyCii.importExternals()).once();
	});

	it("exportExternals(): void", () => {
		const cii: ComponentInternalsImpl = getNewCII();
		const spyCii: ComponentInternalsImpl = spy(cii);
		cii.exportExternals();
		verify(spyCii.exportExternals()).once();
	});

});
