import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardLayout from "./_components/DashboardLayout";

export default async function DashboardTemplate({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/prihlaseni");
	}

	return <DashboardLayout user={session.user}>{children}</DashboardLayout>;
}
