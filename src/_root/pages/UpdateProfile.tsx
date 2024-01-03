import { useNavigate, useParams } from "react-router-dom"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast"
import ProfileUploader from "@/components/shared/ProfileUploader";
import Loader from '@/components/shared/Loader'

import { ProfileValidation } from "@/lib/validation"
import { useUserContext } from "@/context/AuthContext"
import { useGetUserByIdMutation, useUpdateUserMutation } from "@/lib/react-query/queriesAndMutations"

const UpdateProfile = () => {
    const { toast } = useToast()
    const { id } = useParams()
    const navigate = useNavigate()

    const { user, setUser } = useUserContext()
    const { data: currUser, isLoading: isUserLoading } = useGetUserByIdMutation(id || "");
    const { mutateAsync: updateUser, isPending: isLoadingUpdate } = useUpdateUserMutation();

    // 1. Define your form.
    const form = useForm<z.infer<typeof ProfileValidation>>({
        resolver: zodResolver(ProfileValidation),
        defaultValues: {
            name: user.name,
            file: [],
            username: user.username,
            email: user.email,
            bio: user.bio || "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof ProfileValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        // if (!currUser) throw Error;

        const updatedUser = await updateUser({
            userId: user.id,
            name: values.name,
            file: values.file,
            bio: values.bio,
            imageUrl: currUser?.imageUrl,
            imageId: currUser?.imageId,
        })

        if (!updateUser) {
            toast({
                variant: "destructive",
                title: "Uh oh! Your profile hasn't been updated.",
                description: "Refresh and try again."
            });
        }

        setUser({
            ...user,
            name: updatedUser?.name,
            bio: updatedUser?.bio,
            imageUrl: updatedUser?.imageUrl,
        });
        return navigate(`/profile/${id}`);
    }

    if (isUserLoading) {
        return (
            <div className="flex-center w-full h-full">
                <Loader />
            </div>
        )
    }

    return (
        <div className="flex flex-1">
            <div className="common-container">
                <div className="max-w-5xl flex-start gap-3 justify-start w-full">
                    <img src="/assets/icons/edit-post.svg" alt="update-profile" height={36} width={36} />
                    <h2 className="h3-bold md:h2-bold text-left w-full">Update Profile</h2>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => (
                                <FormItem className="flex">
                                    <FormControl>
                                        <ProfileUploader fieldChange={field.onChange} mediaUrl={currUser?.imageUrl} />
                                    </FormControl>
                                    <FormMessage className="shad-form_message" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="shad-form_label">Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="shad-input" {...field} />
                                    </FormControl>
                                    <FormMessage className="shad-form_message" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="shad-form_label">Username</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="shad-input" {...field} />
                                    </FormControl>
                                    <FormMessage className="shad-form_message" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="shad-form_label">Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" className="shad-input" {...field} />
                                    </FormControl>
                                    <FormMessage className="shad-form_message" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="shad-form_label">Bio</FormLabel>
                                    <FormControl>
                                        <Textarea className="shad-textarea custom-scrollbar" {...field} />
                                    </FormControl>
                                    <FormMessage className="shad-form_message" />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4 items-center justify-end">
                            <Button type="button" className="shad-button_dark_4">Cancel</Button>
                            <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingUpdate}>
                                {isLoadingUpdate ? 'Loading...' : `Update Profile`}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default UpdateProfile