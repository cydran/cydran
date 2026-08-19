import { Component } from "@cydran/cydran";
import TEMPLATE from "./SeriesBehaviorSpecimen.html";
import SeriesItem from "./SeriesItem";

/**
 * Specimen: `SeriesBehavior` (`<c-series name="items">`). Components are inserted, removed,
 * replaced, and cleared imperatively through `$c().forSeries("items")`. Each button
 * exercises one `SeriesOperations` method; `count` tracks the size for a model-side mirror.
 * Item labels are uniquely numbered so tests can assert both count and order.
 */
class SeriesBehaviorSpecimen extends Component {

	private count: number;

	private nextId: number;

	constructor() {
		super(TEMPLATE);
		this.count = 0;
		this.nextId = 0;
	}

	private makeItem(): SeriesItem {
		this.nextId = this.nextId + 1;
		return new SeriesItem("Item " + this.nextId);
	}

	public addLast(): void {
		this.$c().forSeries("items").insertLast(this.makeItem());
		this.count = this.count + 1;
	}

	public addFirst(): void {
		this.$c().forSeries("items").insertFirst(this.makeItem());
		this.count = this.count + 1;
	}

	public insertSecond(): void {
		// insertBefore(1) targets the existing element at index 1, so index 1 must be in
		// bounds -- i.e. there must be at least two items already.
		if (this.count >= 2) {
			this.$c().forSeries("items").insertBefore(1, this.makeItem());
			this.count = this.count + 1;
		}
	}

	public replaceFirst(): void {
		if (this.count >= 1) {
			this.$c().forSeries("items").replaceAt(0, this.makeItem());
		}
	}

	public removeFirst(): void {
		if (this.count >= 1) {
			this.$c().forSeries("items").removeAt(0);
			this.count = this.count - 1;
		}
	}

	public removeLast(): void {
		if (this.count >= 1) {
			this.$c().forSeries("items").removeAt(this.count - 1);
			this.count = this.count - 1;
		}
	}

	public clearAll(): void {
		this.$c().forSeries("items").clear();
		this.count = 0;
	}

}

export default SeriesBehaviorSpecimen;
