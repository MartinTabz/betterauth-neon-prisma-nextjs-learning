"use client";

import * as React from "react";
import { File, PodcastIcon } from "lucide-react";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const data = {
	navMain: [
		{
			title: "Příspěvky",
			url: "/nastenka",
			icon: File,
			isActive: true,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/admin">
								<div className="text-sidebar-primary-foreground flex aspect-square size-8 bg-primary items-center justify-center rounded-lg">
									<PodcastIcon className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight gap-[3px]">
									<span className="truncate font-bold text-base leading-none uppercase">
										Příspěvky
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={props.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
