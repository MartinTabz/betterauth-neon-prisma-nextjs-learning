"use client";

import { ChevronsUpDown, Loader, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useState } from "react";
import Link from "next/link";
import { User } from "better-auth";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function NavUser({ user }: { user: User }) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { isMobile } = useSidebar();

	const router = useRouter();

	const handleSignOut = async (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();

		setIsLoading(true);

		await signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/prihlaseni");
				},
			},
		});
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								{user.image && <AvatarImage src={user.image} />}
								<AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
									{user.name[0]}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg bg-beige-900">
									{user.image && <AvatarImage src={user.image} />}
									<AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
										{user.name[0]}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<Link href={"/"}>
								<DropdownMenuItem className="cursor-pointer">
									Přejít na hlavní stránku
								</DropdownMenuItem>
							</Link>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem disabled={isLoading}>
							<button
								onClick={handleSignOut}
								disabled={isLoading}
								className="flex items-center gap-2 cursor-pointer"
							>
								{isLoading ? (
									<Loader className="animate-spin w-5" />
								) : (
									<LogOut className="w-5" />
								)}
								Odhlásit se
							</button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
