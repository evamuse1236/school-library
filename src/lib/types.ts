export interface Book {
	id: string;
	title: string;
	author: string;
	summary: string;
	tags: string[];
	driveUrl: string;
	coverUrl: string;
	prompts: Prompt[];
	format: 'book' | 'comic' | 'audiobook';
	pages?: number;
	createdAt: string;
}

export interface Prompt {
	id: string;
	label: string;
	minWords: number;
	maxWords: number;
}

export interface Student {
	id: string;
	name: string;
	class?: string;
	createdAt: string;
}

export interface Completion {
	id: string;
	studentId: string;
	bookId: string;
	finishedAt: string;
	responses: Response[];
	seen: boolean;
}

export interface Response {
	promptId: string;
	text: string;
	wordCount: number;
}

export interface Session {
	sessionId: string;
	studentId: string;
	name: string;
	class?: string;
}

export interface ShelfItem {
	bookId: string;
	addedAt: string;
	lastOpened?: string;
}

export interface StudentShelf {
	favourites: ShelfItem[];
	reading: ShelfItem[];
	finished: Completion[];
}

export type MoodTag = 'Funny' | 'Adventure' | 'Magical' | 'Thinky' | 'True Stories' | 'Short Reads';
export type BookFormat = 'book' | 'comic' | 'audiobook';
export type SortOption = 'new' | 'popular' | 'a-z' | 'under-100';

export interface FilterState {
	search: string;
	moods: MoodTag[];
	formats: BookFormat[];
	sort: SortOption;
}

export interface Toast {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info';
	duration?: number;
}