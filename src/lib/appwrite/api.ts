import { ID, Query } from "appwrite";
import { INewPost, INewUser } from "@/types";
import { appwriteConfig, account, avatars, databases, storage } from "./config";

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
		return e;
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
		return e;
	}
}

export async function signInAccount(user: { email: string; password: string }) {
	try {
		const session = await account.createEmailSession(user.email, user.password);

		return session;
	} catch (e) {
		console.log(e);
		return e;
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

export async function createNewPost(post: INewPost) {
	try {
		// Upload img to storage
		const uploadedFile = await uploadFile(post.file[0]);
		if (!uploadedFile) throw Error;

		// Get file url
		const fileUrl = getFilePreview(uploadedFile.$id);
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
				imageUrl: fileUrl,
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
