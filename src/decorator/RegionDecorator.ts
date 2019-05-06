import {Decorator} from "../Core";

class RegionDecorator extends Decorator<string> {

	public wire(): void {
		const name: string = this.getExpression();
		this.getEl().setAttribute("data-region-id", name);
		this.getParentView().getRegion(name).setEl(this.getEl());
	}

	public unwire(): void {
		const name: string = this.getExpression();
		this.getParentView().getRegion(name).setEl(null);
	}

}

export default RegionDecorator;
