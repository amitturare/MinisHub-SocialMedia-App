import { Helmet } from "react-helmet-async";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import Loader from "@/components/shared/Loader";

import { SignInValidation } from "@/lib/validation"
import { useSignInAccountMutation } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const SignInForm = () => {
    const { toast } = useToast()
    const navigate = useNavigate()
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext()

    const { mutateAsync: signInAccount } = useSignInAccountMutation();

    // 1. Define your form.
    const form = useForm<z.infer<typeof SignInValidation>>({
        resolver: zodResolver(SignInValidation),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof SignInValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const session = await signInAccount({ email: values.email, password: values.password })
        if (!session) {
            return toast({
                variant: "destructive",
                title: "Uh oh! Sign in failed.",
                description: "Refresh and try again."
            });
        }

        const isLoggedIn = await checkAuthUser();
        if (isLoggedIn) {
            form.reset();
            navigate('/')
        } else {
            return toast({
                variant: "destructive",
                title: "Uh oh! Sign in failed.",
                description: "Try again with correct credentials."
            });
        }
    }

    return (
        <Form {...form}>
            <Helmet>
                <title>Minis Hub | Sign In</title>
            </Helmet>
            <div className="sm:w-420 flex-center flex-col">
                <img src="/assets/images/justLogo.svg" className="w-20 sm:w-36" alt="logo" />

                <h2 className="h2-bold pt-2">Minis Hub</h2>
                <h2 className="h3-bold md:h2-bold pt-2 sm:pt-8">Welcome back!</h2>
                <p className="text-light-3 small-medium md:base-regular mt-2">Log in to your account</p>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="shad-button_primary">
                        {
                            isUserLoading ? (<div className="flex-center gap-2"><Loader />Loading...</div>) :
                                "Sign In"
                        }
                    </Button>

                    <p className="text-small-regular text-light-2 text-center mt-2">
                        Don't have an account?
                        <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">Sign Up</Link>
                    </p>
                </form>
            </div >
        </Form>
    )
}

export default SignInForm