import React, { useState, useEffect } from "react";
import { Models } from "appwrite"

import Loader from "./Loader";

import { useDeleteSavedPostMutation, useGetCurrentUserMutation, useLikePostMutation, useSavePostMutation } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";

type IPostStats = {
    post: Models.Document;
    userId: string;
}

const PostStats = ({ post, userId }: IPostStats) => {
    const { mutateAsync: likePost } = useLikePostMutation()
    const { mutateAsync: savePost, isPending: isSavingPost } = useSavePostMutation()
    const { mutateAsync: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavedPostMutation()

    const likesList = post.likes.map((user: Models.Document) => user.$id)

    const { data: user } = useGetCurrentUserMutation()

    const [likes, setLikes] = useState<string[]>(likesList);
    const [isSaved, setIsSaved] = useState<boolean>(false);

    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation();

        let newLikes = [...likes];

        const currHasLiked = newLikes.includes(userId)
        if (currHasLiked) {
            newLikes = newLikes.filter(id => id != userId)
        } else {
            newLikes.push(userId)
        }

        setLikes(newLikes)
        likePost({ postId: post.$id, likesArray: newLikes })
    }

    const savedPostRecord = user?.save.find((record: Models.Document) =>
        record.post.$id === post.$id
    )
    useEffect(() => {
        setIsSaved(savedPostRecord ? true : false)
    }, [user])
    const handleSavePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        e.stopPropagation();

        if (savedPostRecord) {
            setIsSaved(false);
            return deleteSavedPost(savedPostRecord.$id)
        }
        setIsSaved(true)
        savePost({ postId: post.$id, userId })

    }

    return (
        <div className="flex justify-between items-center z-20">
            <div className="flex flex-center gap-2 mr-5">
                <img
                    src={checkIsLiked(likes, userId)
                        ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
                    alt="like"
                    height={22}
                    width={22}
                    onClick={handleLikePost}
                    className="cursor-pointer"
                />
                <p className="small-medium lg:base-medium">{likes.length}</p>
            </div>

            <div className="flex flex-center gap-2">
                {isSavingPost || isDeletingSaved ? <Loader /> : <img
                    src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
                    alt="save"
                    height={22}
                    width={22}
                    onClick={handleSavePost}
                    className="cursor-pointer"
                />}
            </div>
        </div>
    )
}

export default PostStats