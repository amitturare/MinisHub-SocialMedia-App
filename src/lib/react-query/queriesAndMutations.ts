import {
	useQuery, // Fetching the data
	useMutation, // Modifying the data
	useQueryClient,
	useInfiniteQuery, // Infinite Scrolling
} from "@tanstack/react-query";

import { INewPost, INewUser, ISigningInUser, IUpdatePost, IUpdateUser } from "@/types";
import {
	createUserAccount,
	signInAccount,
	signOutAccount,
	createNewPost,
	getRecentPosts,
	likePost,
	savePost,
	deleteSavedPost,
	getCurrentUser,
	getPostById,
	updatePost,
	deletePost,
	getInfinitePosts,
	searchPosts,
	getInfiniteUsers,
	getUsers,
	getUserById,
	updateUser,
} from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";

export const useCreateUserAccountMutation = () => {
	return useMutation({
		mutationFn: (user: INewUser) => createUserAccount(user),
	});
};

export const useSignInAccountMutation = () => {
	return useMutation({
		mutationFn: (user: ISigningInUser) => signInAccount(user),
	});
};

export const useSignOutAccountMutation = () => {
	return useMutation({
		mutationFn: signOutAccount,
	});
};

export const useGetCurrentUserMutation = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_CURRENT_USER],
		queryFn: getCurrentUser,
	});
};

export const useGetUserByIdMutation = (userId: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
		queryFn: () => getUserById(userId),
		enabled: !!userId,
	});
};

export const useUpdateUserMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (user: IUpdateUser) => updateUser(user),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
			});
		},
	});
};

export const useGetInfiniteUsersMutation = () => {
	return useInfiniteQuery({
		queryKey: [QUERY_KEYS.GET_INFINITE_USERS],
		queryFn: getInfiniteUsers,
		getNextPageParam: (lastPage) => {
			if (!lastPage) throw Error;

			if (lastPage && lastPage.documents.length === 0) return null;

			const lastId = lastPage.documents[lastPage.documents.length - 1].$id;

			return lastId;
		},
	});
};

export const useGetUsersMutation = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_USERS],
		queryFn: getUsers,
	});
};

export const useCreatePostMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (post: INewPost) => createNewPost(post),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
		},
	});
};

export const useGetRecentPostsMutation = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
		queryFn: getRecentPosts,
	});
};

export const useLikePostMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ postId, likesArray }: { postId: string; likesArray: string[] }) => likePost(postId, likesArray),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});
		},
	});
};

export const useSavePostMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ postId, userId }: { postId: string; userId: string }) => savePost(postId, userId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});
		},
	});
};

export const useDeleteSavedPostMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});
		},
	});
};

export const useGetPostByIdMutation = (postId: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
		queryFn: () => getPostById(postId),
		enabled: !!postId, // To not fetch constantly for the same postId
	});
};

export const useUpdatePostMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (post: IUpdatePost) => updatePost(post),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.id],
			});
		},
	});
};

export const useDeletePostMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) => deletePost(postId, imageId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
		},
	});
};

export const useGetPostsMutation = () => {
	return useInfiniteQuery({
		queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
		queryFn: getInfinitePosts,
		getNextPageParam: (lastPage) => {
			if (!lastPage) throw Error;

			if (lastPage && lastPage.documents.length === 0) return null;

			const lastId = lastPage.documents[lastPage.documents.length - 1].$id;

			return lastId;
		},
	});
};

export const useSearchPostsMutation = (searchTerm: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
		queryFn: () => searchPosts(searchTerm),
		enabled: !!searchTerm,
	});
};
