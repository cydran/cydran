interface Digester {

	skipId(id: string): void;

	digest(): void;

}

export default Digester;
