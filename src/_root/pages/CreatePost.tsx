import { Link } from "react-router-dom";

import PostForm from "@/components/forms/PostForm"
import Loader from '@/components/shared/Loader'

import { useGetCurrentUserMutation } from "@/lib/react-query/queriesAndMutations"
import GridPostList from "@/components/shared/GridPostList";

const CreatePost = () => {
    const { data: user, isLoading: isUserLoading } = useGetCurrentUserMutation();

    return (
        <div className="flex flex-1">
            <div className="common-container">
                <div className="max-w-5xl flex-start gap-3 justify-start w-full">
                    <img src="/assets/icons/add-post.svg" alt="add" height={36} width={36} />
                    <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
                </div>

                <PostForm action="Create" />
            </div>

            {/* <div className="hidden xl:flex flex-col w-72 2xl:w-465 px-6 py-10 gap-10  overflow-scroll custom-scrollbar"> */}
            <div className="w-72 2xl:w-465 overflow-scroll custom-scrollbar max-lg:hidden">
                {isUserLoading ? (
                    <div className="flex-center w-full h-full"><Loader /></div>
                ) : (
                    <div className="flex flex-col gap-10 pr-8 pl-8">
                        <Link to={`/profile/${user?.$id}`} className="flex-center flex-col w-full h-full gap-4 mt-16">
                            <img
                                src={user?.imageUrl || "/assets/icons/profile-placeholder.svg"}
                                alt="creator"
                                className="rounded-full w-24 h-24 mt-15"
                            />

                            <div className="flex-center flex-col gap-1">
                                <p className="h2-bold text-light-1 text-center line-clamp-1">
                                    {user?.name}
                                </p>
                                <p className="base-regular text-light-3 text-center line-clamp-1">
                                    @{user?.username}
                                </p>
                            </div>
                            {/* {creators?.documents.map((creator) => (
                                <li key={creator?.$id}>
                                    <CreatorCard user={creator} />
                                </li>
                            ))} */}
                        </Link>

                        <div className="flex flex-col gap-6">
                            <h3 className="h3-bold text-light-2">Top posts by you</h3>
                            <GridPostList posts={user?.posts} showStats={true} showUser={false} sideBar={true} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CreatePost