import { AppSidebar } from "./Sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { User } from "better-auth";

export default function DashboardLayout({
	children,
	user,
}: {
	children: React.ReactNode;
	user: User;
}) {
	return (
		<SidebarProvider>
			<AppSidebar user={user} />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
					</div>
				</header>
				<main className="px-5">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
