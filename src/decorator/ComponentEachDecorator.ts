import AbstractElementDecorator from "../mvvm/AbstractDecorator";
import View from "../component/Component";

class ComponentEachElementDecorator extends AbstractElementDecorator<any> {

	private children: View[];

	public wire(): void {
		this.children = [];
		let value = this.getTarget();
		this.onTargetChange(value);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(value: any): void {
		let el: HTMLElement = this.getEl();

		for (var i = 0;i < this.children.length;i++) {
			this.children[i].dispose();
		}

		this.children = [];

		while (el.firstChild) {
			el.removeChild(el.firstChild);
		}

		let tag: string = value[0];
		let factory = value[1];
		let items = value[2];

		for (var i = 0;i < items.length;i++) {
			let item: any = items[i];
			let child: HTMLElement = el.appendChild(document.createElement(tag));
			item._id = i;
			let component: View = factory(item);
			component.setEl(child);
			component.setParentView(this.getParentView());
			this.children.push(component);
		}
	}

}

export default ComponentEachElementDecorator;