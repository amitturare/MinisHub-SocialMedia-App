import { ID, Query } from "appwrite";
import { INewPost, INewUser, IUpdatePost } from "@/types";
import { appwriteConfig, account, avatars, databases, storage } from "./config";

// USER REGISTRATION AND LOGIN
export async function createUserAccount(user: INewUser) {
	try {
		const newAccount = await account.create(ID.unique(), user.email, user.password, user.name);

		if (!newAccount) throw Error;

		const avatarUrl = avatars.getInitials(user.name);

		const newUser = await saveUserToDB({
			accountId: newAccount.$id,
			name: newAccount.name,
			email: newAccount.email,
			username: user.username, // From form value
			imageUrl: avatarUrl,
		});

		return newUser;
	} catch (e) {
		console.log(e);
	}
}

export async function saveUserToDB(user: {
	accountId: string;
	email: string;
	name: string;
	imageUrl: URL;
	username: string;
}) {
	try {
		const newUserDoc = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.usersCollectionId,
			ID.unique(),
			user
		);

		return newUserDoc;
	} catch (e) {
		console.log(e);
	}
}

export async function signInAccount(user: { email: string; password: string }) {
	try {
		const session = await account.createEmailSession(user.email, user.password);

		return session;
	} catch (e) {
		console.log(e);
	}
}

export async function getCurrentUser() {
	try {
		const currAccount = await account.get();
		if (!currAccount) throw Error;

		const currUser = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [
			Query.equal("accountId", currAccount.$id),
		]);
		if (!currUser) throw Error;

		return currUser.documents[0];
	} catch (e) {
		console.log(e);
	}
}

export async function signOutAccount() {
	try {
		const session = await account.deleteSession("current");

		return session;
	} catch (e) {
		console.log(e);
	}
}

export async function getInfiniteUsers({ pageParam }: { pageParam: number }) {
	const queries = [Query.limit(20)];

	if (pageParam) {
		queries.push(Query.cursorAfter(pageParam.toString()));
	}

	try {
		const users = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.usersCollectionId,
			queries
		);

		if (!users) throw Error;

		return users;
	} catch (e) {
		console.log(e);
	}
}

export async function getUsers() {
	try {
		const users = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [
			Query.orderDesc("$createdAt"),
			Query.limit(10),
		]);

		if (!users) throw Error;

		return users;
	} catch (e) {
		console.log(e);
	}
}

// POST CRUD
export async function createNewPost(post: INewPost) {
	try {
		// Upload img to storage
		const uploadedFile = await uploadFile(post.file[0]);
		if (!uploadedFile) throw Error;

		// Get file url
		const fileUrl = await getFilePreview(uploadedFile.$id);
		if (!fileUrl) {
			await deleteFile(uploadedFile.$id);
			throw Error;
		}

		// Convert tags to array
		const tags = post.tags?.replace(/ /g, "").split(",") || [];

		const newPost = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postsCollectionId,
			ID.unique(),
			{
				creator: post.userId,
				caption: post.caption,
				imageUrl: fileUrl.href,
				imageId: uploadedFile.$id,
				location: post.location,
				tags: tags,
			}
		);

		if (!newPost) {
			await deleteFile(uploadedFile.$id);
			throw Error;
		}

		return newPost;
	} catch (e) {
		console.log(e);
	}
}

export async function uploadFile(file: File) {
	try {
		const uploadedFile = await storage.createFile(appwriteConfig.storageId, ID.unique(), file);

		return uploadedFile;
	} catch (e) {
		console.log(e);
	}
}

export async function getFilePreview(fileId: string) {
	try {
		const fileUrl = await storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, "top", 100);

		return fileUrl;
	} catch (e) {
		console.log(e);
	}
}

export async function deleteFile(fileId: string) {
	try {
		await storage.deleteFile(appwriteConfig.storageId, fileId);

		return { status: "ok" };
	} catch (e) {
		console.log(e);
	}
}

export async function getRecentPosts() {
	const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.postsCollectionId, [
		Query.orderDesc("$createdAt"),
		Query.limit(20),
	]);

	if (!posts) throw Error;

	return posts;
}

export async function likePost(postId: string, likesArray: string[]) {
	try {
		const updatedPost = await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postsCollectionId,
			postId,
			{
				likes: likesArray,
			}
		);

		if (!updatedPost) throw Error;

		return updatedPost;
	} catch (e) {
		console.log(e);
	}
}

export async function savePost(postId: string, userId: string) {
	try {
		const savedPost = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.savesCollectionId,
			ID.unique(),
			{
				user: userId,
				post: postId,
			}
		);

		if (!savedPost) throw Error;

		return savedPost;
	} catch (e) {
		console.log(e);
	}
}

export async function deleteSavedPost(savedRecordId: string) {
	try {
		const statusCode = await databases.deleteDocument(
			appwriteConfig.databaseId,
			appwriteConfig.savesCollectionId,
			savedRecordId
		);

		if (!statusCode) throw Error;

		return { status: "ok" };
	} catch (e) {
		console.log(e);
	}
}

export async function getPostById(postId: string) {
	try {
		const post = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.postsCollectionId, postId);

		return post;
	} catch (e) {
		console.log(e);
	}
}

export async function updatePost(post: IUpdatePost) {
	const hasFileToUpdate = post.file.length > 0;
	try {
		let image = {
			imageUrl: post.imageUrl,
			imageId: post.imageId,
		};

		if (hasFileToUpdate) {
			// Upload img to storage
			const uploadedFile = await uploadFile(post.file[0]);
			if (!uploadedFile) throw Error;

			// Get file url
			const fileUrl = await getFilePreview(uploadedFile.$id);
			if (!fileUrl) {
				await deleteFile(uploadedFile.$id);
				throw Error;
			}

			image = { ...image, imageUrl: fileUrl.toString(), imageId: uploadedFile.$id };
		}

		// Convert tags to array
		const tags = post.tags?.replace(/ /g, "").split(",") || [];

		const updatedPost = await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postsCollectionId,
			post.postId,
			{
				caption: post.caption,
				imageUrl: image.imageUrl,
				imageId: image.imageId,
				location: post.location,
				tags: tags,
			}
		);

		if (!updatedPost) {
			await deleteFile(post.imageId);
			throw Error;
		}

		return updatedPost;
	} catch (e) {
		console.log(e);
	}
}

export async function deletePost(postId: string, imageId: string) {
	if (!postId || !imageId) throw Error;

	try {
		const statusCode = await databases.deleteDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postsCollectionId,
			postId
		);

		if (!statusCode) throw Error;

		await storage.deleteFile(appwriteConfig.storageId, imageId);

		return { status: "ok" };
	} catch (e) {
		console.log(e);
	}
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
	const queries = [Query.orderDesc("$updatedAt"), Query.limit(5)];

	if (pageParam) {
		queries.push(Query.cursorAfter(pageParam.toString()));
	}

	try {
		const posts = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.postsCollectionId,
			queries
		);

		if (!posts) throw Error;

		return posts;
	} catch (e) {
		console.log(e);
	}
}

export async function searchPosts(searchTerm: string) {
	try {
		const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.postsCollectionId, [
			Query.search("caption", searchTerm),
		]);

		if (!posts) throw Error;

		return posts;
	} catch (e) {
		console.log(e);
	}
}
