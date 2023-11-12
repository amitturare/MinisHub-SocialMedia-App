import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function timeAgo(dateString: string): string {
	const currentDate: Date = new Date();
	const postDate: Date = new Date(dateString);

	// Calculate the difference in milliseconds
	const timeDifference: number = currentDate.getTime() - postDate.getTime();

	// Convert the difference to seconds, minutes, hours, and days
	const secondsDifference: number = Math.floor(timeDifference / 1000);
	const minutesDifference: number = Math.floor(secondsDifference / 60);
	const hoursDifference: number = Math.floor(minutesDifference / 60);
	const daysDifference: number = Math.floor(hoursDifference / 24);

	// Format the result
	if (daysDifference > 5) {
		const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		const day: number = postDate.getDate();
		const monthAbbreviation: string = months[postDate.getMonth()];

		return `${day} ${monthAbbreviation}`;
	} else if (daysDifference > 0) {
		return `${daysDifference} days ago`;
	} else if (hoursDifference > 0) {
		return `${hoursDifference} hours ago`;
	} else if (minutesDifference > 0) {
		return `${minutesDifference} minutes ago`;
	} else {
		return "Just now";
	}
}

export const checkIsLiked = (likeList: string[], userId: string) => {
	return likeList.includes(userId);
};
