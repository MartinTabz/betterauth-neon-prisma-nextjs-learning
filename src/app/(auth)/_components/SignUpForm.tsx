"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Loader, UserPlus } from "lucide-react";
import { signUp } from "../actions";
import { toast } from "sonner";

export const signUpFormSchema = z
	.object({
		name: z
			.string()
			.min(2, "Jméno musí mít alespoň 2 znaky")
			.max(755, "Jméno může mít maximálně 755 znaků"),
		email: z
			.email({ error: "E-mail není validní" })
			.min(5, "E-mail není validní")
			.max(255, "E-mail může mít maximálně 255 znaků"),
		password: z
			.string()
			.min(8, "Heslo musí mít alespoň 8 znaků")
			.max(255, "Heslo může mít maximálně 255 znaků"),
		passwordverification: z.string(),
	})
	.refine((data) => data.password === data.passwordverification, {
		message: "Hesla se musí shodovat",
		path: ["passwordverification"],
	});

export default function SignUpForm() {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const form = useForm<z.infer<typeof signUpFormSchema>>({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			passwordverification: "",
		},
	});

	async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
		setIsLoading(true);

		const { error } = await signUp(values);

		if (error) {
			toast.error(error);
		}

		setIsLoading(false);
	}

	return (
		<section className="w-full h-dvh flex items-center justify-center">
			<Card className="w-full max-w-[350px]">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardHeader>
							<CardTitle>Registrace účtu</CardTitle>
							<CardDescription>
								Níže vložte svůj email a vytvořte si heslo
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-4 py-5">
							<FormField
								control={form.control}
								name="name"
								disabled={isLoading}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Jméno</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								disabled={isLoading}
								render={({ field }) => (
									<FormItem>
										<FormLabel>E-Mail</FormLabel>
										<FormControl>
											<Input type="email" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								disabled={isLoading}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Heslo</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="passwordverification"
								disabled={isLoading}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Kontrola hesla</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter>
							<Button
								size={"lg"}
								className="w-full cursor-pointer"
								disabled={isLoading}
								type="submit"
							>
								{isLoading ? <Loader className="animate-spin" /> : <UserPlus />}
								Registrovat
							</Button>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</section>
	);
}
