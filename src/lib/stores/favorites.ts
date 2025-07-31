import { writable } from 'svelte/store';
import type { ShelfItem, StudentShelf, Completion } from '$lib/types';

function createFavoritesStore() {
	const { subscribe, set, update } = writable<StudentShelf>({
		favourites: [],
		reading: [],
		finished: []
	});

	return {
		subscribe,
		
		// Initialize from localStorage
		init: (studentId: string) => {
			if (typeof window !== 'undefined') {
				const stored = localStorage.getItem(`shelf-${studentId}`);
				if (stored) {
					try {
						const shelf = JSON.parse(stored);
						set(shelf);
					} catch (e) {
						console.warn('Failed to parse stored shelf:', e);
					}
				}
				
				// Also load completions
				const completions = JSON.parse(localStorage.getItem('completions') || '[]');
				const studentCompletions = completions.filter((c: Completion) => c.studentId === studentId);
				
				update(shelf => ({
					...shelf,
					finished: studentCompletions
				}));
			}
		},
		
		// Save book to favorites
		addToFavorites: (bookId: string, studentId: string) => {
			update(shelf => {
				const newItem: ShelfItem = {
					bookId,
					addedAt: new Date().toISOString()
				};
				
				const updatedShelf = {
					...shelf,
					favourites: [...shelf.favourites.filter(item => item.bookId !== bookId), newItem]
				};
				
				// Save to localStorage
				if (typeof window !== 'undefined') {
					localStorage.setItem(`shelf-${studentId}`, JSON.stringify(updatedShelf));
				}
				
				return updatedShelf;
			});
		},
		
		// Remove from favorites
		removeFromFavorites: (bookId: string, studentId: string) => {
			update(shelf => {
				const updatedShelf = {
					...shelf,
					favourites: shelf.favourites.filter(item => item.bookId !== bookId)
				};
				
				// Save to localStorage
				if (typeof window !== 'undefined') {
					localStorage.setItem(`shelf-${studentId}`, JSON.stringify(updatedShelf));
				}
				
				return updatedShelf;
			});
		},
		
		// Add to reading list
		addToReading: (bookId: string, studentId: string) => {
			update(shelf => {
				const newItem: ShelfItem = {
					bookId,
					addedAt: new Date().toISOString(),
					lastOpened: new Date().toISOString()
				};
				
				const updatedShelf = {
					...shelf,
					reading: [...shelf.reading.filter(item => item.bookId !== bookId), newItem]
				};
				
				// Save to localStorage
				if (typeof window !== 'undefined') {
					localStorage.setItem(`shelf-${studentId}`, JSON.stringify(updatedShelf));
				}
				
				return updatedShelf;
			});
		},
		
		// Remove from reading list
		removeFromReading: (bookId: string, studentId: string) => {
			update(shelf => {
				const updatedShelf = {
					...shelf,
					reading: shelf.reading.filter(item => item.bookId !== bookId)
				};
				
				// Save to localStorage
				if (typeof window !== 'undefined') {
					localStorage.setItem(`shelf-${studentId}`, JSON.stringify(updatedShelf));
				}
				
				return updatedShelf;
			});
		},
		
		// Check if book is in favorites
		isFavorite: (bookId: string, shelf: StudentShelf): boolean => {
			return shelf.favourites.some(item => item.bookId === bookId);
		},
		
		// Check if book is in reading list
		isReading: (bookId: string, shelf: StudentShelf): boolean => {
			return shelf.reading.some(item => item.bookId === bookId);
		},
		
		// Check if book is finished
		isFinished: (bookId: string, shelf: StudentShelf): boolean => {
			return shelf.finished.some(completion => completion.bookId === bookId);
		}
	};
}

export const favoritesStore = createFavoritesStore();