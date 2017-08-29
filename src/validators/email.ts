let emailRegex = /^[A-Za-z0-9._]*\@[A-Za-z]*\.[A-Za-z]{2,5}$/;

export function email(input) {
    return emailRegex.test(input);
}

