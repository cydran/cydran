import { Component, argumentsBuilder } from "@cydran/cydran";
import TEMPLATE from "./ErrorCatalogSpecimen.html";

/**
 * Diagnostic specimen: deliberately triggers developer-facing Cydran errors and records the
 * thrown error's `name` + `message`, so the error catalog can be verified empirically (the
 * exact class and message a developer actually sees), not just from reading throw sites.
 */
class ErrorCatalogSpecimen extends Component {

	private results: { [key: string]: string };

	constructor() {
		super(TEMPLATE);
		this.results = {};
	}

	public onMount(): void {
		// Seed the locked region so a later replacement attempt is rejected.
		this.$c().regions().set("lockedSlot", new Component("<span>original</span>"));
	}

	private capture(key: string, fn: () => void): void {
		let result: string;

		try {
			fn();
			result = "(no error thrown)";
		} catch (e) {
			const err = e as Error;
			result = (err && err.name ? err.name : "Error") + ": " + (err ? err.message : "");
		}

		this.results = { ...this.results, [key]: result };
	}

	public templateMultiNode(): void {
		this.capture("templateMultiNode", () => new Component("<div></div><div></div>"));
	}

	public templateScript(): void {
		this.capture("templateScript", () => new Component("<script></script>"));
	}

	public unknownRegion(): void {
		this.capture("unknownRegion", () => this.$c().regions().set("noSuchRegion", new Component("<span>x</span>")));
	}

	public lockedRegion(): void {
		this.capture("lockedRegion", () => this.$c().regions().set("lockedSlot", new Component("<span>replacement</span>")));
	}

	public unknownForm(): void {
		this.capture("unknownForm", () => this.$c().forForm("noSuchForm"));
	}

	public unknownElement(): void {
		this.capture("unknownElement", () => this.$c().forElement("noSuchElement"));
	}

	public unknownSeries(): void {
		this.capture("unknownSeries", () => this.$c().forSeries("noSuchSeries"));
	}

	public bounds(): void {
		this.capture("bounds", () => this.$c().forSeries("mySeries").getAt(99));
	}

	public duplicate(): void {
		this.capture("duplicate", () => {
			const child: Component = new Component("<span>dup</span>");
			this.$c().forSeries("mySeries").insertLast(child);
			this.$c().forSeries("mySeries").insertLast(child); // same instance again -> throws
		});
	}

	public namingConflict(): void {
		this.capture("namingConflict", () => {
			this.$c().getContext().addChild("dupChildContext");
			this.$c().getContext().addChild("dupChildContext"); // duplicate name -> throws
		});
	}

	public unknownContext(): void {
		this.capture("unknownContext", () => this.$c().getContext().removeChild("noSuchChildContext"));
	}

	public unknownProperty(): void {
		this.capture("unknownProperty", () =>
			this.$c().getContext().getProperties().modify("no.such.property", (v: unknown) => v));
	}

	public prefixMismatch(): void {
		this.capture("prefixMismatch", () =>
			this.$c().getContext().getProperties().getWithFallback("aaa.bbb.ccc", "xxx.yyy"));
	}

	public invalidStateBuilder(): void {
		this.capture("invalidStateBuilder", () => {
			const b = argumentsBuilder();
			b.build();
			b.build(); // reuse after build -> throws
		});
	}

	public validationPrefix(): void {
		this.capture("validationPrefix", () => new Component("<div>x</div>", { prefix: "bad prefix" }));
	}

}

export default ErrorCatalogSpecimen;
