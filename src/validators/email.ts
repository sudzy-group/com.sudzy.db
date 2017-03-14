export function email(input) {
	let emailRegex = /^[A-Za-z0-9._]*\@[A-Za-z]*\.[A-Za-z]{2,5}$/;
    return emailRegex.test(input);
}

