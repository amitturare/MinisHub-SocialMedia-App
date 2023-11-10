import { ID, Query } from "appwrite";
import { INewUser } from "@/types";
import { appwriteConfig, account, avatars, databases } from "./config";

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
