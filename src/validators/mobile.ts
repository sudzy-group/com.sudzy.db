let phoneRegex =  /^[0-9]{9,14}$/;

export function mobile(input) {
    return phoneRegex.test(input);
}