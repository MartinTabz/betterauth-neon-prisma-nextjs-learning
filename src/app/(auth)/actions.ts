"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import type { z } from "zod";
import type { signUpFormSchema } from "./_components/SignUpForm";
import type { signInFormSchema } from "./_components/SignInForm";

export async function signUp(values: z.infer<typeof signUpFormSchema>) {
	const { name, email, password } = values;

	const response = await auth.api.signUpEmail({
		body: {
			name,
			email,
			password,
		},
		asResponse: true,
	});

	if (response.status !== 200) {
		return {
			error: "Něco se pokazilo",
		};
	}

	redirect("/prihlaseni");
}

export async function signIn(values: z.infer<typeof signInFormSchema>) {
	const { email, password } = values;

	const response = await auth.api.signInEmail({
		body: {
			email,
			password,
		},
		asResponse: true,
	});

	if (!response.ok) {
		console.log(response);
		return {
			error: "Něco se pokazilo při přihlašování",
		};
	}

	redirect("/nastenka");
}
