import { msg } from "behavior/core/each/Bundle";

test("msg", () => {
	expect(msg("only-one-message", "c", "-", "item")).toEqual('must have only one child <template c-type="item"> node/element.');
});
