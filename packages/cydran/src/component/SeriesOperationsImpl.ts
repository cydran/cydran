import { Nestable, SeriesOperations } from 'context/Context';
import Series from 'component/Series';
import { requireNotNull } from 'util/Utils';

class SeriesOperationsImpl implements SeriesOperations {

	private series: Series

	constructor(series: Series) {
		this.series = requireNotNull(series, "series");
	}

	public replace(oldComponent: Nestable, newComponent: Nestable): void {
		this.series.replace(oldComponent, newComponent);
	}

	public insertBefore(index: number, component: Nestable): void {
		this.series.insertBefore(index, component);
	}

	public insertAfter(index: number, component: Nestable): void {
		this.series.insertAfter(index, component);
	}

	public insertFirst(component: Nestable): void {
		this.series.insertFirst(component);
	}

	public insertLast(component: Nestable): void {
		this.series.insertLast(component);
	}

	public getAt<N extends Nestable>(index: number): N {
		return this.series.getAt(index);
	}

	public replaceAt(index: number, component: Nestable): void {
		this.series.replaceAt(index, component);
	}

	public remove(component: Nestable): void {
		this.series.remove(component);
	}

	public removeAt(index: number): void {
		this.series.removeAt(index);
	}

	public hasComponents(): boolean {
		return this.series.hasComponents();
	}

	public contains(component: Nestable): boolean {
		return this.series.contains(component);
	}

	public isEmpty(): boolean {
		return this.series.isEmpty();
	}

	public clear(): void {
		this.series.clear();
	}

}

export default SeriesOperationsImpl;