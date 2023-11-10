import {
	useQuery, // Fetching the data
	useMutation, // Modifying the data
	useQueryClient,
	useInfiniteQuery, // Infinite Scrolling
} from "@tanstack/react-query";

import { INewUser, SigningInUser } from "@/types";
import { createUserAccount, signInAccount, signOutAccount } from "../appwrite/api";

export const useCreateUserAccountMutation = () => {
	return useMutation({
		mutationFn: (user: INewUser) => createUserAccount(user),
	});
};

export const useSignInAccountMutation = () => {
	return useMutation({
		mutationFn: (user: SigningInUser) => signInAccount(user),
	});
};

export const useSignOutAccountMutation = () => {
	return useMutation({
		mutationFn: signOutAccount,
	});
};
