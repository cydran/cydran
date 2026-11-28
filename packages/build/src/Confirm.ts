import readline from "readline/promises";
import { requireNotNull } from "./Utils.js";

/** The option that skips the confirmation prompt. */
const YES_OPTION: string = "yes";

async function ask(message: string): Promise<boolean> {
	const prompt: readline.Interface = readline.createInterface({ input: process.stdin, output: process.stdout });
	let proceed: boolean = false;

	try {
		const answer: string = (await prompt.question(`\n${message} Proceed? [y/N] `)).trim().toLowerCase();
		proceed = answer === "y" || answer === "yes";

		if (!proceed) {
			console.log("No changes made.");
		}
	} finally {
		prompt.close();
	}

	return proceed;
}

/**
 * Asks whether to apply a planned change. Proceeds without asking when --yes was given, asks on an interactive
 * terminal (defaulting to no), and otherwise exits with a non-zero code without changing anything.
 */
async function confirm(taskName: string, message: string, yes: boolean): Promise<boolean> {
	requireNotNull(taskName, "taskName");
	requireNotNull(message, "message");
	requireNotNull(yes, "yes");

	let proceed: boolean = false;

	if (yes) {
		console.log(`\n${message} Proceeding (--yes).`);
		proceed = true;
	} else if (process.stdin.isTTY) {
		proceed = await ask(message);
	} else {
		console.error(`\n${message} No changes made: ${taskName} requires an interactive terminal or --yes.`);
		process.exit(1);
	}

	return proceed;
}

export { YES_OPTION, confirm };
