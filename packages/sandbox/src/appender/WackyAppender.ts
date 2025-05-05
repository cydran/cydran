import { Appender } from "@cydran/cydran";

function randomCaps(str) {
	// Split the string into an array of characters
	let chars = str.split('');
	
	// Map through each character and randomly decide to capitalize it
	chars = chars.map(char => {
		// Generate a random number (0 or 1)
		const random = Math.floor(Math.random() * 2);
		// If 0, return lowercase; if 1, return uppercase
		return random === 0 ? char.toLowerCase() : char.toUpperCase();
	});
	
	// Join the characters back into a string and return
	return chars.join('');
}

class WackyAppender implements Appender {

	public getId(): string {
		return "id";
	}

	public getAlias(): string {
		return "Wacky";
	}

	public trace(label: string, message: string, error?: Error, moreArgs?: unknown[]): void {
		console.log("Trace: " + randomCaps(message));
	}

	public debug(label: string, message: string, error?: Error, moreArgs?: unknown[]): void {
		console.log("Debug: " + randomCaps(message));
	}

	public info(label: string, message: string, error?: Error, moreArgs?: unknown[]): void {
		console.log("Info: " + randomCaps(message));
	}

	public warn(label: string, message: string, error?: Error, moreArgs?: unknown[]): void {
		console.log("Warn: " + randomCaps(message));
	}

	public error(label: string, message: string, error?: Error, moreArgs?: unknown[]): void {
		console.log("Error: " + randomCaps(message));
	}
	public fatal(label: string, message: string, error?: Error, moreArgs?: unknown[]): void {
		console.log("Fatal: " + randomCaps(message));
	}

}

export default WackyAppender;