import SignUpForm from "../_components/SignUpForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session != null) {
		redirect("/nastenka");
	}

	return <SignUpForm />;
}
