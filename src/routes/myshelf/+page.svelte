<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { sessionStore } from '$lib/stores/session';
	import { booksStore } from '$lib/stores/books';
	import { favoritesStore } from '$lib/stores/favorites';
	import BookCard from '$lib/components/BookCard.svelte';
	import SkeletonLoader from '$lib/components/SkeletonLoader.svelte';
	import type { Book, Completion } from '$lib/types';

	let activeTab: 'favourites' | 'reading' | 'finished' = 'favourites';
	let isLoading = true;

	onMount(() => {
		// Initialize session store
		sessionStore.init();
		
		// Redirect if no session
		const unsubscribe = sessionStore.subscribe(session => {
			if (!session.name) {
				goto('/enter');
			} else if (session.studentId) {
				// Initialize favorites store
				favoritesStore.init(session.studentId);
				isLoading = false;
			}
		});
		
		return unsubscribe;
	});

	// Get books for each tab
	$: favoriteBooks = $favoritesStore.favourites
		.map(item => $booksStore.find(book => book.id === item.bookId))
		.filter((book): book is Book => book !== undefined)
		.sort((a, b) => {
			const aItem = $favoritesStore.favourites.find(item => item.bookId === a.id);
			const bItem = $favoritesStore.favourites.find(item => item.bookId === b.id);
			return new Date(bItem?.addedAt || 0).getTime() - new Date(aItem?.addedAt || 0).getTime();
		});

	$: readingBooks = $favoritesStore.reading
		.map(item => $booksStore.find(book => book.id === item.bookId))
		.filter((book): book is Book => book !== undefined)
		.sort((a, b) => {
			const aItem = $favoritesStore.reading.find(item => item.bookId === a.id);
			const bItem = $favoritesStore.reading.find(item => item.bookId === b.id);
			return new Date(bItem?.lastOpened || bItem?.addedAt || 0).getTime() - new Date(aItem?.lastOpened || aItem?.addedAt || 0).getTime();
		});

	$: finishedBooks = $favoritesStore.finished
		.map(completion => $booksStore.find(book => book.id === completion.bookId))
		.filter((book): book is Book => book !== undefined)
		.sort((a, b) => {
			const aCompletion = $favoritesStore.finished.find(c => c.bookId === a.id);
			const bCompletion = $favoritesStore.finished.find(c => c.bookId === b.id);
			return new Date(bCompletion?.finishedAt || 0).getTime() - new Date(aCompletion?.finishedAt || 0).getTime();
		});

	function handleTabChange(tab: 'favourites' | 'reading' | 'finished') {
		activeTab = tab;
	}

	function handleBookClick(event: CustomEvent) {
		const book = event.detail;
		goto(`/book/${book.id}`);
	}

	function handleBookSave(event: CustomEvent) {
		const book = event.detail;
		if ($sessionStore.studentId) {
			if (favoritesStore.isFavorite(book.id, $favoritesStore)) {
				favoritesStore.removeFromFavorites(book.id, $sessionStore.studentId);
				showToast('Removed from favorites', 'info');
			} else {
				favoritesStore.addToFavorites(book.id, $sessionStore.studentId);
				showToast('Added to favorites', 'success');
			}
		}
	}

	function handleBookOpen(event: CustomEvent) {
		const book = event.detail;
		if ($sessionStore.studentId) {
			favoritesStore.addToReading(book.id, $sessionStore.studentId);
		}
		goto(`/read/${book.id}`);
	}

	function showToast(message: string, type: string) {
		// Simple toast implementation
		const toast = document.createElement('div');
		toast.className = `fixed bottom-4 right-4 bg-primary-teal text-white px-4 py-2 rounded-card shadow-lg z-50 transition-all duration-gentle`;
		toast.textContent = message;
		
		document.body.appendChild(toast);
		
		setTimeout(() => {
			toast.classList.add('opacity-0', 'translate-y-2');
			setTimeout(() => {
				document.body.removeChild(toast);
			}, 300);
		}, 3000);
	}

	// Get completion date for finished books
	function getCompletionDate(bookId: string): string {
		const completion = $favoritesStore.finished.find(c => c.bookId === bookId);
		if (completion) {
			return new Date(completion.finishedAt).toLocaleDateString();
		}
		return '';
	}
</script>

<svelte:head>
	<title>My Shelf - School Library</title>
</svelte:head>

<div class="min-h-screen bg-warm">
	<div class="max-w-content mx-auto px-4 py-8">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-3xl font-heading font-bold text-primary-teal mb-2">
				My Shelf
			</h1>
			<p class="text-charcoal opacity-75">
				Your reading journey, saved just for you
			</p>
		</div>

		{#if isLoading}
			<!-- Loading State -->
			<div class="bg-white rounded-card shadow-gentle p-6">
				<div class="book-grid">
					<SkeletonLoader type="card" count={6} />
				</div>
			</div>
		{:else}
			<!-- Tabs -->
			<div class="bg-white rounded-card shadow-gentle mb-8">
				<div class="flex border-b border-gray-200">
					<button
						on:click={() => handleTabChange('favourites')}
						class="flex-1 px-6 py-4 text-center font-medium transition-colors duration-gentle"
						class:text-primary-teal={activeTab === 'favourites'}
						class:border-b-2={activeTab === 'favourites'}
						class:border-primary-teal={activeTab === 'favourites'}
						class:text-charcoal={activeTab !== 'favourites'}
						class:opacity-75={activeTab !== 'favourites'}
					>
						💝 Favourites ({favoriteBooks.length})
					</button>
					<button
						on:click={() => handleTabChange('reading')}
						class="flex-1 px-6 py-4 text-center font-medium transition-colors duration-gentle"
						class:text-primary-teal={activeTab === 'reading'}
						class:border-b-2={activeTab === 'reading'}
						class:border-primary-teal={activeTab === 'reading'}
						class:text-charcoal={activeTab !== 'reading'}
						class:opacity-75={activeTab !== 'reading'}
					>
						📖 Reading ({readingBooks.length})
					</button>
					<button
						on:click={() => handleTabChange('finished')}
						class="flex-1 px-6 py-4 text-center font-medium transition-colors duration-gentle"
						class:text-primary-teal={activeTab === 'finished'}
						class:border-b-2={activeTab === 'finished'}
						class:border-primary-teal={activeTab === 'finished'}
						class:text-charcoal={activeTab !== 'finished'}
						class:opacity-75={activeTab !== 'finished'}
					>
						✨ Finished ({finishedBooks.length})
					</button>
				</div>

				<!-- Tab Content -->
				<div class="p-6">
					{#if activeTab === 'favourites'}
						{#if favoriteBooks.length > 0}
							<div class="book-grid">
								{#each favoriteBooks as book (book.id)}
									<BookCard
										{book}
										on:click={handleBookClick}
										on:save={handleBookSave}
										on:open={handleBookOpen}
									/>
								{/each}
							</div>
						{:else}
							<!-- Empty Favourites -->
							<div class="text-center py-12">
								<div class="text-5xl mb-4">💝</div>
								<h3 class="text-xl font-heading font-semibold text-charcoal mb-2">
									No favourites yet
								</h3>
								<p class="text-charcoal opacity-75 mb-6">
									When you find books you love, save them here for easy access.
								</p>
								<a href="/discover" class="btn-primary">
									Discover Books
								</a>
							</div>
						{/if}
					{:else if activeTab === 'reading'}
						{#if readingBooks.length > 0}
							<div class="book-grid">
								{#each readingBooks as book (book.id)}
									<BookCard
										{book}
										on:click={handleBookClick}
										on:save={handleBookSave}
										on:open={handleBookOpen}
									/>
								{/each}
							</div>
						{:else}
							<!-- Empty Reading -->
							<div class="text-center py-12">
								<div class="text-5xl mb-4">📖</div>
								<h3 class="text-xl font-heading font-semibold text-charcoal mb-2">
									No books in progress
								</h3>
								<p class="text-charcoal opacity-75 mb-6">
									Books you start reading will appear here automatically.
								</p>
								<a href="/discover" class="btn-primary">
									Find Something to Read
								</a>
							</div>
						{/if}
					{:else if activeTab === 'finished'}
						{#if finishedBooks.length > 0}
							<div class="space-y-6">
								{#each finishedBooks as book (book.id)}
									<div class="bg-accent-mist rounded-card p-4 flex items-center space-x-4">
										<!-- Book Cover Thumbnail -->
										<div class="w-16 h-20 bg-white rounded flex-shrink-0 overflow-hidden">
											<img
												src={book.coverUrl}
												alt="Cover of {book.title}"
												class="w-full h-full object-cover"
												loading="lazy"
											/>
										</div>
										
										<!-- Book Info -->
										<div class="flex-1 min-w-0">
											<h4 class="font-heading font-semibold text-charcoal mb-1 truncate">
												{book.title}
											</h4>
											<p class="text-sm text-charcoal opacity-75 mb-2">
												by {book.author}
											</p>
											<p class="text-xs text-charcoal opacity-60">
												Completed on {getCompletionDate(book.id)}
											</p>
										</div>
										
										<!-- Actions -->
										<div class="flex space-x-2">
											<button
												on:click={() => goto(`/book/${book.id}`)}
												class="btn-secondary text-sm px-4 py-2"
											>
												View Details
											</button>
										</div>
									</div>
								{/each}
							</div>
						{:else}
							<!-- Empty Finished -->
							<div class="text-center py-12">
								<div class="text-5xl mb-4">✨</div>
								<h3 class="text-xl font-heading font-semibold text-charcoal mb-2">
									No completed books yet
								</h3>
								<p class="text-charcoal opacity-75 mb-6">
									Books you finish and reflect on will be celebrated here.
								</p>
								<a href="/discover" class="btn-primary">
									Start Your First Book
								</a>
							</div>
						{/if}
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>