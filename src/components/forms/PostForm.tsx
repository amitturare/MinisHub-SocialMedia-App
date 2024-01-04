import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Models } from "appwrite"
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
import { Textarea } from "../ui/textarea"
import { useToast } from "../ui/use-toast"
import FileUploader from "../shared/FileUploader"

import { CreatePostValidation } from "@/lib/validation"
import { useCreatePostMutation, useUpdatePostMutation } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"


type PostFormProps = {
    post?: Models.Document;
    action: 'Create' | 'Update';
}

const PostForm = ({ post, action }: PostFormProps) => {
    const { toast } = useToast()
    const navigate = useNavigate()

    const { user } = useUserContext()
    const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePostMutation();
    const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePostMutation();

    // 1. Define your form.
    const form = useForm<z.infer<typeof CreatePostValidation>>({
        resolver: zodResolver(CreatePostValidation),
        defaultValues: {
            caption: post ? post?.caption : "",
            file: [],
            location: post ? post?.location : "",
            tags: post ? post?.tags.join(',') : ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof CreatePostValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        if (post && action === 'Update') {
            const updatedPost = await updatePost({
                ...values,
                postId: post.$id,
                imageId: post?.imageId,
                imageUrl: post?.imageUrl
            })

            if (!updatedPost) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Post hasn't been updated.",
                    description: "Refresh and try again."
                });
            }

            return navigate(`/posts/${post.$id}`)
        }
        const newPost = await createPost({ ...values, userId: user.id })

        if (!newPost) {
            toast({
                variant: "destructive",
                title: "Uh oh! Post hasn't been created.",
                description: "Refresh and try again."
            });
        }

        navigate("/")
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Caption</FormLabel>
                            <FormControl>
                                <Textarea className="shad-textarea custom-scrollbar" {...field} />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Add Photos</FormLabel>
                            <FormControl>
                                <FileUploader fieldChange={field.onChange} mediaUrl={post?.imageUrl} />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Add Location</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" {...field} />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Add Tags (separated by comma " , ")</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" placeholder="Culture, Travel, Photography" {...field} />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4 items-center justify-end">
                    <Link to="/">
                        <Button type="button" className="shad-button_dark_4">Cancel</Button>
                    </Link>
                    <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingCreate || isLoadingUpdate}>
                        {isLoadingCreate || isLoadingUpdate ? 'Loading...' : `${action} Post`}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default PostForm