import Factories from 'factory/Factories';
import PropertiesImpl from "properties/PropertiesImpl";

const WKPROPS: PropertiesImpl = new PropertiesImpl();


test("importFactories", () => {
  const wkSpy: Factories = jest.spyOn(Factories, 'importFactories');
  Factories.importFactories(WKPROPS);
  expect(wkSpy).toHaveBeenNthCalledWith(1, WKPROPS);
});