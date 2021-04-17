import * as fs from "fs";

test("Cydran should be defined and populated", () => {
	const specimen: any = Function(fs.readFileSync("./dist/cydran.js", "utf8") + "\n\nreturn cydran;")();
	expect(specimen).not.toBeNull();
	expect(specimen["Component"]).toBeDefined();
});
