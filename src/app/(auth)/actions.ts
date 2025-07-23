"use server";

import { auth } from "@/lib/auth";

import type { z } from "zod";
import type { signUpFormSchema } from "./_components/SignUpForm";
import { redirect } from "next/navigation";

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
