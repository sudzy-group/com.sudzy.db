export function mobile(input) {
	let phoneRegex =  /^[1-9][0-9]{9,14}$/;
	console.log("regex for") 
	console.log(input)
	console.log(phoneRegex.test(input))
    return phoneRegex.test(input);
}