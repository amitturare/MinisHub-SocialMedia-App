import { Models } from "appwrite";

import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";

import { useGetUserByIdMutation } from "@/lib/react-query/queriesAndMutations";

type LikedAndSavedPostsProps = {
    id: string;
    postType: 'Liked' | 'Saved';
}

const LikedAndSavedPosts = ({ id, postType }: LikedAndSavedPostsProps) => {
    const { data: user } = useGetUserByIdMutation(id);

    const savedPosts = user?.save.map((savePost: Models.Document) => ({
        ...savePost.post,
        creator: {
            imageUrl: user.imageUrl,
        },
    })).reverse();

    if (!user)
        return (
            <div className="flex-center w-full h-full">
                <Loader />
            </div>
        );

    return (
        <>
            {postType === 'Liked' && user.liked.length === 0 && (
                <div className="flex-center w-full h-full">
                    <p className="text-light-4 py-10">No liked posts here</p>
                </div>
            )}

            {postType === 'Saved' && savedPosts.length === 0 && (
                <div className="flex-center w-full h-full">
                    <p className="text-light-4 py-10">Save the posts you like</p>
                </div>
            )}

            <GridPostList posts={postType === 'Liked' ? user.liked : savedPosts} showStats={false} />
        </>
    );
};

export default LikedAndSavedPosts;