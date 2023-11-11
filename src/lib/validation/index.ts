import * as z from "zod";

export const SignUpValidation = z.object({
	name: z.string().min(2, { message: "Name too short" }),
	username: z.string().min(2, { message: "Username must be at least 2 characters." }),
	email: z.string().email(),
	password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const SignInValidation = z.object({
	email: z.string().email(),
	password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const CreatePostValidation = z.object({
	caption: z.string().min(1).max(2200),
	file: z.custom<File[]>(),
	location: z.string().min(1).max(2200),
	tags: z.string(),
});
