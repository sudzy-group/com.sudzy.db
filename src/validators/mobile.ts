export function mobile(input) {
	let phoneRegex =  /^[0-9]{9,14}$/;
    return phoneRegex.test(input);
}