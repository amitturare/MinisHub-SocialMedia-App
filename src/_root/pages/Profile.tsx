import { Link, useParams } from "react-router-dom"

import Loader from "@/components/shared/Loader"
import StatBlock from "@/components/shared/StatBlock"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import GridPostList from "@/components/shared/GridPostList"
import LikedAndSavedPosts from "./LikedAndSavedPosts"


import { useUserContext } from "@/context/AuthContext"
import { useGetUserByIdMutation } from "@/lib/react-query/queriesAndMutations"
import { useState } from "react"

const Profile = () => {
    const { id } = useParams()
    const { user } = useUserContext()

    const { data: currUser, isLoading: isUserLoading } = useGetUserByIdMutation(id || "");

    const [currTab, setCurrTab] = useState('posts')
    function onValueChangeHandler(e: string) {
        setCurrTab(e)
    }

    if (isUserLoading) {
        return (
            <div className="flex-center w-full h-full">
                <Loader />
            </div>
        )
    }

    return (
        <div className="profile-container">
            <div className="profile-inner_container">
                <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
                    <img src={currUser?.imageUrl || "/assets/icons/profile-placeholder.svg"} alt="profile-pic" className="w-28 h-28 lg:h-36 lg:w-36 rounded-full" />

                    <div className="flex flex-col flex-1 justify-between md:mt-2">
                        <div className="flex flex-col w-full">
                            <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                                {currUser?.name}
                            </h1>
                            <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                                @{currUser?.username}
                            </p>
                        </div>

                        <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
                            <StatBlock value={currUser?.posts.length} label="Posts" />
                            {/* // Insert for Followers
                        // Following */}
                        </div>
                        <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
                            {currUser?.bio}
                        </p>
                    </div>

                    <div className="flex justify-center gap-4">
                        <div className={`${user.id !== currUser?.$id && "hidden"}`}>
                            <Link
                                to={`/update-profile/${currUser?.$id}`}
                                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${user.id !== currUser?.$id && "hidden"
                                    }`}>
                                <img
                                    src={"/assets/icons/edit.svg"}
                                    alt="edit"
                                    width={20}
                                    height={20}
                                />
                                <p className="flex whitespace-nowrap small-medium">
                                    Edit Profile
                                </p>
                            </Link>
                        </div>
                        <div className={`${user.id === id && "hidden"}`}>
                            <Button type="button" className="shad-button_primary px-8">
                                Follow
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="posts" className="flex flex-col gap-5" onValueChange={onValueChangeHandler}>
                <div className="flex justify-center">
                    <TabsList>
                        <TabsTrigger value="posts">
                            <div
                                className={`profile-tab rounded-lg ${currTab === 'posts' && "bg-dark-4"}`}>
                                <img
                                    src={"/assets/icons/posts.svg"}
                                    alt="posts"
                                    width={20}
                                    height={20}
                                />
                                Posts
                            </div>
                        </TabsTrigger>
                        <TabsTrigger value="liked">
                            <div
                                className={`profile-tab rounded-lg ${currTab === 'liked' && "bg-dark-4"}`}>
                                <img
                                    src={"/assets/icons/like.svg"}
                                    alt="like"
                                    width={20}
                                    height={20}
                                />
                                Liked Posts
                            </div>
                        </TabsTrigger>
                        <TabsTrigger value="saved" className={`${user.id !== currUser?.$id && "hidden"}`}>
                            <div
                                className={`profile-tab rounded-lg ${currTab === 'saved' && "bg-dark-4"}`}>
                                <img
                                    src={"/assets/icons/save.svg"}
                                    alt="like"
                                    width={20}
                                    height={20}
                                />
                                Saved Posts
                            </div>
                        </TabsTrigger>
                    </TabsList>
                </div>
                <div>
                    <TabsContent className="w-full" value="posts"><GridPostList posts={currUser?.posts} showUser={false} /></TabsContent>
                    <TabsContent className="w-full" value="liked"><LikedAndSavedPosts postType="Liked" id={id || ""} /></TabsContent>
                    <TabsContent className="w-full" value="saved"><LikedAndSavedPosts postType="Saved" id={id || ""} /></TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

export default Profile