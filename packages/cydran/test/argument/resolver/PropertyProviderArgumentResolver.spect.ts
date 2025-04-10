import { mock, instance } from "ts-mockito";
import Context from "context/Context";
import PropertyProviderArgumentResolver from "argument/resolver/PropertyProviderArgumentResolver";
import GlobalContextImpl from "context/GlobalContextImpl";
import PropertyKeys from "const/PropertyKeys";

let wkContext: Context;

beforeAll(() => {
	wkContext = new GlobalContextImpl().createChild();
});

test("specimen is whole", () => {
	const specimen: PropertyProviderArgumentResolver = new PropertyProviderArgumentResolver(PropertyKeys.CYDRAN_LOG_LEVEL);
	expect(specimen).not.toBeNull();
});

test("resolve", () => {
	const specimen: PropertyProviderArgumentResolver = new PropertyProviderArgumentResolver(PropertyKeys.CYDRAN_LOG_LEVEL);
	expect(specimen.resolve(wkContext)).toEqual("debug");
});
