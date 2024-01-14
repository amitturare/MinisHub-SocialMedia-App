import { Helmet } from 'react-helmet-async';

import Loader from '@/components/shared/Loader'
import UserCard from "@/components/shared/UserCard";

import { useGetInfiniteUsersMutation } from "@/lib/react-query/queriesAndMutations";

const AllUsers = () => {
    const { data: creators } = useGetInfiniteUsersMutation();

    if (!creators) {
        return (
            <div className='flex-center w-full h-full'>
                <Loader />
            </div>
        )
    }

    console.log(creators);

    return (
        <div className="common-container">
            <Helmet>
                <title>People</title>
            </Helmet>
            <div className="user-container">
                <h2 className="h3-bold md:h2-bold text-left w-full">Other Users</h2>
                <UserCard users={creators?.documents} />
            </div>
        </div>
    );
};

export default AllUsers;