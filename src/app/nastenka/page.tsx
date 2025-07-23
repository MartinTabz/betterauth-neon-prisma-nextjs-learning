import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/prihlaseni");
	}

	const posts = await prisma.post.findMany({
		where: {
			userId: session.user.id,
		},
	});

	return (
		<div>
			<h1>Ahoj, vítej zde!</h1>
			<section>
				<pre>{JSON.stringify(posts, null, 2)}</pre>
			</section>
		</div>
	);
}
