import Loader from "@/components/shared/Loader";
import UpdateProfileForm from "@/components/forms/UpdateProfileForm";

import { useGetUserByIdMutation } from "@/lib/react-query/queriesAndMutations"
import { useParams } from "react-router-dom";

const UpdateProfile = () => {
    const { id } = useParams()
    const { data: currUser } = useGetUserByIdMutation(id || "");

    return (
        <div className="flex flex-1">
            <div className="common-container">
                <div className="max-w-5xl flex-start gap-3 justify-start w-full">
                    <img src="/assets/icons/edit-post.svg" alt="update-profile" height={36} width={36} />
                    <h2 className="h3-bold md:h2-bold text-left w-full">Update Profile</h2>
                </div>
                
                {!currUser ? (<div className="flex-center w-full h-full">
                    <Loader />
                </div>) : (
                    <UpdateProfileForm currUser={currUser} />
                )}
            </div>
        </div>
    )
}

export default UpdateProfile