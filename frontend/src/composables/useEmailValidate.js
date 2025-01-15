//compoasables/useEmailValidate.js

"use strict";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useEmailValidate() {
	function validate(email) {
		if (!EMAIL_REGEX.test(email.value)) {
			return "Please enter a valid email address.";
		}
		return "";
	}

	return {
		validate,
	};
}
