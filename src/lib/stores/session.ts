import { writable } from 'svelte/store';
import type { Session } from '$lib/types';

interface SessionState {
	sessionId: string | null;
	studentId: string | null;
	name: string | null;
	class: string | null;
}

const initialState: SessionState = {
	sessionId: null,
	studentId: null,
	name: null,
	class: null
};

function createSessionStore() {
	const { subscribe, set, update } = writable<SessionState>(initialState);

	return {
		subscribe,
		
		// Initialize session from localStorage
		init: () => {
			if (typeof window !== 'undefined') {
				const stored = localStorage.getItem('school-library-session');
				if (stored) {
					try {
						const session = JSON.parse(stored);
						set(session);
					} catch (e) {
						console.warn('Failed to parse stored session:', e);
						localStorage.removeItem('school-library-session');
					}
				}
			}
		},
		
		// Create new session
		create: (name: string, className?: string) => {
			const sessionId = crypto.randomUUID();
			const studentId = crypto.randomUUID();
			
			const session: SessionState = {
				sessionId,
				studentId,
				name: name.trim(),
				class: className?.trim() || null
			};
			
			// Handle duplicate names by adding suffix
			if (typeof window !== 'undefined') {
				const existingSessions = JSON.parse(localStorage.getItem('all-sessions') || '[]');
				const duplicates = existingSessions.filter((s: SessionState) => 
					s.name === session.name && s.class === session.class
				);
				
				if (duplicates.length > 0) {
					// Add numeric suffix internally (not shown to student)
					session.studentId = `${studentId}-${duplicates.length + 1}`;
				}
				
				// Store in both current session and all sessions
				localStorage.setItem('school-library-session', JSON.stringify(session));
				existingSessions.push(session);
				localStorage.setItem('all-sessions', JSON.stringify(existingSessions));
			}
			
			set(session);
			return session;
		},
		
		// Clear session
		clear: () => {
			if (typeof window !== 'undefined') {
				localStorage.removeItem('school-library-session');
			}
			set(initialState);
		},
		
		// Update session
		update: (updates: Partial<SessionState>) => {
			update(current => {
				const updated = { ...current, ...updates };
				if (typeof window !== 'undefined') {
					localStorage.setItem('school-library-session', JSON.stringify(updated));
				}
				return updated;
			});
		}
	};
}

export const sessionStore = createSessionStore();