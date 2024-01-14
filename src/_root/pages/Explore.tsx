import { Helmet } from 'react-helmet-async'
import { useState } from 'react'

import { Input } from '@/components/ui/input'
import SearchResults from '@/components/shared/SearchResults'
import GridPostList from '@/components/shared/GridPostList'
import Loader from '@/components/shared/Loader'

import { useGetPostsMutation, useSearchPostsMutation } from '@/lib/react-query/queriesAndMutations'
import useDebounce from '@/hooks/useDebounce'


const Explore = () => {
    const { data: posts } = useGetPostsMutation();

    const [searchVal, setSearchVal] = useState('')
    const debouncedValue = useDebounce(searchVal, 500);
    const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPostsMutation(debouncedValue)

    console.log(posts);

    if (!posts) {
        return (
            <div className='flex-center w-full h-full'>
                <Loader />
            </div>
        )
    }

    const shouldShowSearchResults = searchVal !== '';
    // const shouldShowPosts = !shouldShowSearchResults && posts.documents.every((item) => item?.documents.length === 0);

    return (
        <div className="explore-container">
            <Helmet>
                <title>Explore</title>
            </Helmet>
            <div className="explore-inner_container">
                <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
                <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
                    <img src="/assets/icons/search.svg" alt="search"
                        height={24}
                        width={24}
                    />
                    <Input
                        type='text'
                        placeholder='Search'
                        className='explore-search'
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-between w-full max-w-5xl mt-16 mb-7">
                <h3 className="body-bold md:h3-bold">Popular Today</h3>

                <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
                    <p className='small-medium md:base-medium text-light-2'>All</p>
                    <img
                        src="/assets/icons/filter.svg"
                        alt="filter"
                        width={20}
                        height={20}
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-9 w-full max-w-5xl">
                {
                    shouldShowSearchResults ? (
                        <SearchResults isSearchFetching={isSearchFetching} searchedPosts={searchedPosts} />
                    ) : !posts ? (
                        <p className='text-light-4 mt-10 text-center w-full'>--- End of posts ---</p>
                    ) : 
                        <GridPostList posts={posts?.documents} />
                    
                }
            </div>

        </div>
    )
}

export default Explore