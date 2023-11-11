import {
	useQuery, // Fetching the data
	useMutation, // Modifying the data
	useQueryClient,
	useInfiniteQuery, // Infinite Scrolling
} from "@tanstack/react-query";

import { INewPost, INewUser, ISigningInUser } from "@/types";
import { createUserAccount, signInAccount, signOutAccount, createNewPost } from "../appwrite/api";
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
