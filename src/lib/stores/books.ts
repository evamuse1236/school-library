import { writable, derived } from 'svelte/store';
import { mockBooks } from '$lib/data/mockBooks';
import type { Book, FilterState, MoodTag, BookFormat, SortOption } from '$lib/types';
import Fuse from 'fuse.js';

// Books store
export const booksStore = writable<Book[]>(mockBooks);

// Filter state store
const initialFilterState: FilterState = {
	search: '',
	moods: [],
	formats: [],
	sort: 'new'
};

export const filterStore = writable<FilterState>(initialFilterState);

// Fuse.js configuration for fuzzy search
const fuseOptions = {
	keys: [
		{ name: 'title', weight: 0.4 },
		{ name: 'author', weight: 0.3 },
		{ name: 'summary', weight: 0.2 },
		{ name: 'tags', weight: 0.1 }
	],
	threshold: 0.4, // More forgiving search
	includeScore: true
};

// Filtered and sorted books derived store
export const filteredBooks = derived(
	[booksStore, filterStore],
	([$books, $filters]) => {
		let filtered = [...$books];

		// Apply search filter
		if ($filters.search.trim()) {
			const fuse = new Fuse(filtered, fuseOptions);
			const results = fuse.search($filters.search.trim());
			filtered = results.map(result => result.item);
		}

		// Apply mood filters
		if ($filters.moods.length > 0) {
			filtered = filtered.filter(book => 
				$filters.moods.some(mood => book.tags.includes(mood))
			);
		}

		// Apply format filters
		if ($filters.formats.length > 0) {
			filtered = filtered.filter(book => 
				$filters.formats.includes(book.format as BookFormat)
			);
		}

		// Apply sorting
		switch ($filters.sort) {
			case 'new':
				filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
				break;
			case 'popular':
				// For now, sort by title as we don't have popularity data
				filtered.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case 'a-z':
				filtered.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case 'under-100':
				filtered = filtered.filter(book => (book.pages || 0) < 100);
				filtered.sort((a, b) => (a.pages || 0) - (b.pages || 0));
				break;
		}

		return filtered;
	}
);

// Filter actions
export const filterActions = {
	setSearch: (search: string) => {
		filterStore.update(state => ({ ...state, search }));
	},
	
	toggleMood: (mood: MoodTag) => {
		filterStore.update(state => ({
			...state,
			moods: state.moods.includes(mood)
				? state.moods.filter(m => m !== mood)
				: [...state.moods, mood]
		}));
	},
	
	toggleFormat: (format: BookFormat) => {
		filterStore.update(state => ({
			...state,
			formats: state.formats.includes(format)
				? state.formats.filter(f => f !== format)
				: [...state.formats, format]
		}));
	},
	
	setSort: (sort: SortOption) => {
		filterStore.update(state => ({ ...state, sort }));
	},
	
	clearFilters: () => {
		filterStore.set(initialFilterState);
	},
	
	surpriseMe: () => {
		// Clear filters and show a random selection
		filterStore.set({ ...initialFilterState, search: '' });
	}
};

// Get random book
export function getRandomBook(): Book {
	const books = mockBooks;
	return books[Math.floor(Math.random() * books.length)];
}