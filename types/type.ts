// types/type.ts

// Define the UserRole interface
export interface UserRole {
	id: string;
	name: string;
}

// Define the User interface
export interface User {
	type: string;
	id: number;
	name: string;
	comment: string;
	login: string;
	email: string;
	language: string;
	theme: string;
	role: UserRole; // Use the UserRole interface for role
	hidden?: boolean; // Optional, since it's not in the original User interface
	disabled?: boolean; // Optional, since it's not in the original User interface
	isguest?: boolean; // Optional, since it's not in the original User interface
	isadmin?: boolean; // Optional, since it's not in the original User interface
}

// Define the structure of the error response
export interface ErrorResponse {
	success: boolean; // This can be true or false based on success
	message: string;
	data: string; // Typically used for error messages
}

// Define the return type of the login function
export type LoginResponse = User | ErrorResponse;

// Define the structure of the account fetch response
export interface FetchAccountResponse {
	success: boolean;
	message: string;
	data: User | null; // Use the User interface for account data
}


export interface FetchChildrenResponse {
	success: boolean;
	message: string;
	data: (Folder | Document)[] | null; // Allow both Folder and Document in the array
}

export interface FetchFolderResponse {
	success: boolean;
	message: string;
	data: (Folder | Document)[]; // Array of Folder or Document types
}

export interface Folder {
	type: 'folder';
	id: number;
	name: string;
	comment?: string; // Comment is optional
	date: string;
}

export interface Document {
	type: 'document';
	id: number;
	name: string;
	date: string;
	comment?: string; // Make comment optional if it's not always present
	keywords?: string; // Make keywords optional if it's not always present
	ownerid: number;
	islocked: boolean;
	sequence: string;
	expires?: string; // Make expires optional if it's not always present
	mimetype: string;
	version: number;
	version_comment?: string; // Make version_comment optional if it's not always present
	version_date: string;
	size: number;
	versionAttributes: Array<{
		id: number;
		value: string;
	}>;
}

export interface FolderPath {
	id: string;
	name: string;
}

export interface GetFolderPathResponse {
	success: boolean;
	message: string;
	data: FolderPath[];
}