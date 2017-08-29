let autocompleteRegex = /^[0-9]/;

export function autocomplete(input) {
    return autocompleteRegex.test(input);
}

