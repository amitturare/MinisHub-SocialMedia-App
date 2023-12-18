import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer'

import Loader from '@/components/shared/Loader'
import UserCard from "@/components/shared/UserCard";

import { useGetInfiniteUsersMutation } from "@/lib/react-query/queriesAndMutations";

const AllUsers = () => {
    const { ref, inView } = useInView()
    const { data: creators, fetchNextPage, hasNextPage } = useGetInfiniteUsersMutation();

    useEffect(() => {
        if (inView) fetchNextPage()
    }, [inView])

    if (!creators) {
        return (
            <div className='flex-center w-full h-full'>
                <Loader />
            </div>
        )
    }

    return (
        <div className="common-container">
            <div className="user-container">
                <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
                {creators?.pages.map((item, index) => (
                    <UserCard key={index} users={item?.documents} />
                ))}
            </div>

            {hasNextPage && (
                <div ref={ref} className='mt-10'>
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default AllUsers;