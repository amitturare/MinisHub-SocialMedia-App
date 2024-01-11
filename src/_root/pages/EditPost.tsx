import { useParams } from "react-router-dom"

import Loader from "@/components/shared/Loader";
import PostForm from "@/components/forms/PostForm"
import PostSidebar from "@/components/shared/PostSidebar";

import { useGetCurrentUserMutation, useGetPostByIdMutation } from "@/lib/react-query/queriesAndMutations";

const EditPost = () => {
    const { id } = useParams();
    const { data: post, isPending: isPostLoading } = useGetPostByIdMutation(id || "");
    const { data: user, isLoading: isUserLoading } = useGetCurrentUserMutation();

    if (isPostLoading) return <Loader />
    return (
        <div className="flex flex-1">
            <div className="common-container">
                <div className="max-w-5xl flex-start gap-3 justify-start w-full">
                    <img src="/assets/icons/edit-post.svg" alt="edit-post" height={36} width={36} />
                    <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
                </div>

                <PostForm action="Update" post={post} />
            </div>

            <div className="w-72 2xl:w-465 overflow-scroll custom-scrollbar max-lg:hidden">
                {isUserLoading ? (
                    <div className="flex-center w-full h-full"><Loader /></div>
                ) : (
                    <PostSidebar user={user} />
                )}
            </div>
        </div>
    )
}

export default EditPost