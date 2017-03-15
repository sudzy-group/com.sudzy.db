export function zip(input) {
	let zipRegex =  /^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/;
    return zipRegex.test(input);
}