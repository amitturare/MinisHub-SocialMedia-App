import { Helmet } from "react-helmet-async"

import PostForm from "@/components/forms/PostForm"
import Loader from '@/components/shared/Loader'
import PostSidebar from "@/components/shared/PostSidebar";

import { useGetCurrentUserMutation } from "@/lib/react-query/queriesAndMutations"

const CreatePost = () => {
    const { data: user, isLoading: isUserLoading } = useGetCurrentUserMutation();

    return (
        <div className="flex flex-1">
            <Helmet>
                <title>Create Post</title>
            </Helmet>
            <div className="common-container">
                <div className="max-w-5xl flex-start gap-3 justify-start w-full">
                    <img src="/assets/icons/add-post.svg" alt="add" height={36} width={36} />
                    <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
                </div>

                <PostForm action="Create" />
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

export default CreatePost