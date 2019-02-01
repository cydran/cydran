import { Decorator } from "../Core";
declare class RegionDecorator extends Decorator<string> {
    wire(): void;
    unwire(): void;
}
export default RegionDecorator;
