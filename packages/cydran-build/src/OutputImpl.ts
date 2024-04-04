import Output from "./Output";

class OutputImpl implements Output {

	public separator(): void {
		console.log("------------------------------------------------------------------------------");
	}

	public blankLine(): void {
		console.log();
	}

	public print(text: string): void {
		console.log(text);
	}

}

export default OutputImpl;
