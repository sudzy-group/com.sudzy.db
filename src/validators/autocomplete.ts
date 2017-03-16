export function autocomplete(input) {
	let autocompleteRegex = /^[0-9]/;
    return autocompleteRegex.test(input);
}

