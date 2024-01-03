import { Link } from "react-router-dom";

import GridPostList from "./GridPostList"

import { Models } from "appwrite"

type PostSidebarProps = {
    user?: Models.Document;
}

const PostSidebar = ({ user }: PostSidebarProps) => {
    return (
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

    )
}

export default PostSidebar