let zipRegex =  /^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/;

export function zip(input) {
    return zipRegex.test(input);
}