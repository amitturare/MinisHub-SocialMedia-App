import { Models } from "appwrite";

import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import CreatorCard from "@/components/shared/CreatorCard";

import { useGetRecentPostsMutation, useGetUsersMutation } from "@/lib/react-query/queriesAndMutations";


const Home = () => {
    const { data: posts, isPending: isPostLoading, isError: isErrorPosts } = useGetRecentPostsMutation();
    const { data: creators, isPending: isCreatorsLoading, isError: isErrorCreators } = useGetUsersMutation();

    if (isErrorPosts || isErrorCreators) {
        return (
            <div className="flex flex-1">
                <div className="home-container">
                    <p className="body-medium text-light-1">Something bad happened</p>
                </div>
                <div className="home-creators">
                    <p className="body-medium text-light-1">Something bad happened</p>
                </div>
            </div>
        );
    }

    if (isPostLoading && !posts && isCreatorsLoading && !creators) {
        return (
            <div className="flex-center w-full h-full">
                <Loader />
            </div>
        )
    }

    return (
        <div className="flex flex-1">
            <div className="home-container">
                <div className="home-posts">
                    <h2 className="h3-bold md:h2-bold text-left w-full">Home</h2>
                    {
                        isPostLoading && !posts && !isCreatorsLoading ? (<Loader />) : (
                            <ul className="flex flex-col flex-1 gap-9 w-full">
                                {posts?.documents.map((post: Models.Document) => {
                                    return (
                                        <PostCard post={post} key={post.$id} />
                                    )
                                })}
                            </ul>)}
                </div>
            </div>

            <div className="home-creators">
                <h3 className="h3-bold text-light-1">Top Creators</h3>
                {isCreatorsLoading && !creators && !isPostLoading ? (<div className="flex-center w-full h-full"><Loader /></div>) : (
                    <ul className="grid 2xl:grid-cols-2 gap-6">
                        {creators?.documents.map((creator) => (
                            <li key={creator?.$id}>
                                <CreatorCard user={creator} />
                            </li>
                        ))}
                    </ul>)}
            </div>
        </div>
    )
}

export default Home