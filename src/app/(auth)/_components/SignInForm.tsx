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
import { signIn } from "../actions";
import { toast } from "sonner";

export const signInFormSchema = z.object({
	email: z
		.email({ error: "E-mail není validní" })
		.min(5, "E-mail není validní"),
	password: z.string().min(1, "Heslo je povinné"),
});

export default function SignInForm() {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const form = useForm<z.infer<typeof signInFormSchema>>({
		resolver: zodResolver(signInFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof signInFormSchema>) {
		setIsLoading(true);

		const { error } = await signIn(values);

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
							<CardTitle>Přihlášení k účtu</CardTitle>
							<CardDescription>
								Níže vložte svoje přihlašovací údaje
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-4 py-5">
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
						</CardContent>
						<CardFooter>
							<Button
								size={"lg"}
								className="w-full cursor-pointer"
								disabled={isLoading}
								type="submit"
							>
								{isLoading ? <Loader className="animate-spin" /> : <UserPlus />}
								Přihlásit
							</Button>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</section>
	);
}
