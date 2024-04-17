import { test, expect, jest } from "@jest/globals";
import Factories from 'factory/Factories';
import PropertiesAlternativeImpl from "properties/PropertiesAlternativeImpl";

const WKPROPS: PropertiesAlternativeImpl = new PropertiesAlternativeImpl();


test("importFactories", () => {
  const wkSpy: Factories = jest.spyOn(Factories, 'importFactories');
  Factories.importFactories(WKPROPS);
  expect(wkSpy).toHaveBeenNthCalledWith(1, WKPROPS);
});