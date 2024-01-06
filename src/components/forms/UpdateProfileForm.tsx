import { useState } from "react"
import { Models } from "appwrite"
import { avatars } from "@/lib/appwrite/config"
import { Link, useNavigate } from "react-router-dom"
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast"
import ProfileUploader from "../shared/ProfileUploader"

import { ProfileValidation } from "@/lib/validation"
import { useUserContext } from "@/context/AuthContext"
import { useDeleteFileMutation, useUpdateUserMutation } from "@/lib/react-query/queriesAndMutations"

type UpdateProfileFormProps = {
    currUser?: Models.Document;
}

const UpdateProfileForm = ({ currUser }: UpdateProfileFormProps) => {
    const { toast } = useToast()
    const navigate = useNavigate()

    const { user, setUser } = useUserContext()
    const { mutateAsync: updateUser, isPending: isLoadingUpdate } = useUpdateUserMutation()
    const { mutateAsync: deleteFile } = useDeleteFileMutation()

    // 1. Define your form.
    const form = useForm<z.infer<typeof ProfileValidation>>({
        resolver: zodResolver(ProfileValidation),
        defaultValues: {
            name: currUser ? currUser.name : "",
            file: [],
            username: currUser ? currUser.username : "",
            email: currUser ? currUser.email : "",
            bio: currUser ? currUser.bio : "",
        },
    })

    const [fileUrl, setFileUrl] = useState<string>(currUser?.imageUrl)
    // const [isRemoved, setIsRemoved] = useState<boolean>(false);

    async function onRemoveImageHandler() {
        await deleteFile(currUser?.imageId);

        const avatarUrl = avatars.getInitials(user.name);
        setFileUrl(avatarUrl.href)
        // setIsRemoved(true);
    }


    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof ProfileValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        // if (!currUser) throw Error;

        const updatedUser = await updateUser({
            ...values,
            userId: user.id,
            imageUrl: fileUrl,
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
        return navigate(`/profile/${currUser?.$id}`);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <img src={fileUrl || "/assets/icons/profile-placeholder.svg"} alt="pf-image"
                            className='h-24 w-24 rounded-full object-cover object-top' />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="bg-dark-4 border-none flex flex-col gap-1" side="right" sideOffset={15}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-dark-3" onSelect={onRemoveImageHandler}>
                            Remove image
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-dark-3">
                            <FormField
                                control={form.control}
                                name="file"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            {/* <Dropzone onDrop={onChangeImageHandler} fieldChange={field.onChange}>
                                                {({ getRootProps, getInputProps }) => (
                                                    <div {...getRootProps()}>
                                                        <input {...getInputProps()} className='cursor-pointer' />
                                                        <p>Change image</p>
                                                    </div>
                                                )}
                                            </Dropzone> */}
                                            <ProfileUploader fieldChange={field.onChange} setFileUrl={setFileUrl} />
                                        </FormControl>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>
                                )}
                            />

                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

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
                                <Input type="text" className="shad-input" {...field} disabled />
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
                                <Input type="email" className="shad-input" {...field} disabled />
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
                    <Link to="/">
                        <Button type="button" className="shad-button_dark_4">Cancel</Button>
                    </Link>
                    <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingUpdate}>
                        {isLoadingUpdate ? 'Loading...' : `Update Profile`}
                    </Button>
                </div>
            </form>
        </Form >
    )
}

export default UpdateProfileForm