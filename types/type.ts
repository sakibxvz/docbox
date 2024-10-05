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
	data: Folder[] | null;
}

export interface Folder {
	type: 'folder';
	id: number;
	name: string;
	comment?: string;
	date: string;
}