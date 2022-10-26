import * as yup from "yup";

export const emailSchema = yup.object({
	email: yup.string().email().required(),
});

export const loginSchema = yup.object({
	username: yup.string().required(),
	password: yup.string().required(),
});

export const signupSchema = yup.object({
	firstName: yup.string().required("first name is required"),
	lastName: yup.string().required("last name is required"),
	email: yup.string().email().required(),
	phone: yup.string().required(),
	gender: yup.string().required(),
	username: yup.string().required(),
	password: yup
		.string()
		.min(4, "password must be 4 or more characters long")
		.required(),
	confirmPassword: yup
		.string()
		.min(4, "password confirmation below minimum (4) characters allowed")
		.required("please confirm the password"),
});
