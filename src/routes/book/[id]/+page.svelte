<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { sessionStore } from '$lib/stores/session';
	import { booksStore } from '$lib/stores/books';
	import { favoritesStore } from '$lib/stores/favorites';
	import type { Book } from '$lib/types';
	import BookCard from '$lib/components/BookCard.svelte';
	import SkeletonLoader from '$lib/components/SkeletonLoader.svelte';

	let book: Book | null = null;
	let recommendedBooks: Book[] = [];
	let isLoading = true;
	let isLoadingRecommendations = true;
	let imageLoaded = false;
	let imageError = false;

	$: bookId = $page.params.id;

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
			}
		});
		
		return unsubscribe;
	});

	// Find the book and recommendations
	$: if ($booksStore && bookId) {
		book = $booksStore.find(b => b.id === bookId) || null;
		
		if (book) {
			// Simulate loading delay for recommendations
			setTimeout(() => {
				recommendedBooks = $booksStore
					.filter(b =>
						b.id !== book!.id &&
						b.tags.some(tag => book!.tags.includes(tag))
					)
					.slice(0, 6);
				isLoadingRecommendations = false;
			}, 800);
		}
		
		isLoading = false;
	}

	function handleImageLoad() {
		imageLoaded = true;
	}

	function handleImageError() {
		imageError = true;
		imageLoaded = true;
	}

	function handleReadBook() {
		if (book) {
			goto(`/read/${book.id}`);
		}
	}

	function handleSaveBook() {
		if (book && $sessionStore.studentId) {
			if (favoritesStore.isFavorite(book.id, $favoritesStore)) {
				favoritesStore.removeFromFavorites(book.id, $sessionStore.studentId);
				showToast('Removed from your shelf', 'info');
			} else {
				favoritesStore.addToFavorites(book.id, $sessionStore.studentId);
				showToast('Added to your shelf. Come back anytime.', 'success');
			}
		}
	}

	function handleRecommendationClick(event: CustomEvent) {
		const recommendedBook = event.detail;
		goto(`/book/${recommendedBook.id}`);
	}

	function handleRecommendationSave(event: CustomEvent) {
		const recommendedBook = event.detail;
		if ($sessionStore.studentId) {
			if (favoritesStore.isFavorite(recommendedBook.id, $favoritesStore)) {
				favoritesStore.removeFromFavorites(recommendedBook.id, $sessionStore.studentId);
				showToast('Removed from your shelf', 'info');
			} else {
				favoritesStore.addToFavorites(recommendedBook.id, $sessionStore.studentId);
				showToast('Added to your shelf. Come back anytime.', 'success');
			}
		}
	}

	function handleRecommendationOpen(event: CustomEvent) {
		const recommendedBook = event.detail;
		goto(`/read/${recommendedBook.id}`);
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

	// Format pages display
	$: pagesText = book?.pages ? `${book.pages} pages` : '';
	$: formatLabel = book?.format === 'comic' ? 'Comic' : book?.format === 'audiobook' ? 'Audiobook' : 'Book';
	$: isFavorite = book ? favoritesStore.isFavorite(book.id, $favoritesStore) : false;
</script>

<svelte:head>
	<title>{book ? `${book.title} - School Library` : 'Book Details - School Library'}</title>
</svelte:head>

<div class="min-h-screen bg-warm">
	<div class="max-w-content mx-auto px-4 py-8">
		{#if isLoading}
			<!-- Loading State -->
			<div class="flex items-center justify-center py-16">
				<div class="text-center">
					<div class="text-6xl mb-4">📚</div>
					<p class="text-charcoal opacity-75">Loading book details...</p>
				</div>
			</div>
		{:else if !book}
			<!-- Book Not Found -->
			<div class="text-center py-16">
				<div class="text-6xl mb-4">📖</div>
				<h1 class="text-2xl font-heading font-bold text-charcoal mb-4">
					Hmm, we can't find that book
				</h1>
				<p class="text-charcoal opacity-75 mb-6">
					It might have been moved or doesn't exist anymore.
				</p>
				<a href="/discover" class="btn-primary">
					← Back to Discover
				</a>
			</div>
		{:else}
			<!-- Book Details -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
				<!-- Book Cover -->
				<div class="lg:col-span-1">
					<div class="aspect-[3/4] bg-accent-mist rounded-card overflow-hidden relative max-w-sm mx-auto">
						{#if !imageLoaded}
							<div class="w-full h-full bg-accent-mist animate-pulse flex items-center justify-center">
								<div class="text-6xl opacity-50">📚</div>
							</div>
						{/if}
						
						{#if !imageError}
							<img
								src={book.coverUrl}
								alt="Cover of {book.title}"
								class="w-full h-full object-cover"
								class:opacity-0={!imageLoaded}
								on:load={handleImageLoad}
								on:error={handleImageError}
							/>
						{:else}
							<!-- Fallback cover -->
							<div class="w-full h-full bg-gradient-to-br from-accent-mist to-primary-teal flex flex-col items-center justify-center text-white p-6">
								<div class="text-5xl mb-4">📖</div>
								<div class="text-lg font-medium text-center leading-tight">
									{book.title}
								</div>
							</div>
						{/if}

						<!-- Format Badge -->
						{#if book.format !== 'book'}
							<div class="absolute top-4 right-4 bg-accent-mango text-charcoal text-sm px-3 py-2 rounded-full font-medium">
								{book.format === 'comic' ? '📚 Comic' : '🎧 Audio'}
							</div>
						{/if}
					</div>
				</div>

				<!-- Book Info -->
				<div class="lg:col-span-2 space-y-6">
					<!-- Title and Author -->
					<div>
						<h1 class="text-3xl md:text-4xl font-heading font-bold text-primary-teal mb-2 leading-tight">
							{book.title}
						</h1>
						<p class="text-xl text-charcoal opacity-75 mb-4">
							by {book.author}
						</p>
						
						<!-- Meta Info -->
						<div class="flex flex-wrap items-center gap-4 text-sm text-charcoal opacity-75">
							<span>{formatLabel}</span>
							{#if pagesText}
								<span>•</span>
								<span>{pagesText}</span>
							{/if}
						</div>
					</div>

					<!-- Tags -->
					{#if book.tags.length > 0}
						<div>
							<h3 class="text-sm font-medium text-charcoal mb-3">Mood</h3>
							<div class="flex flex-wrap gap-2">
								{#each book.tags as tag}
									<span class="inline-block bg-accent-mist text-charcoal text-sm px-3 py-1 rounded-full">
										{tag}
									</span>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Summary -->
					<div>
						<h3 class="text-lg font-heading font-semibold text-charcoal mb-3">What's it about?</h3>
						<p class="text-charcoal leading-relaxed">
							{book.summary}
						</p>
					</div>

					<!-- Action Buttons -->
					<div class="flex flex-wrap gap-4 pt-4">
						<button
							on:click={handleReadBook}
							class="btn-primary text-lg px-8 py-4"
						>
							Start Reading
						</button>
						<button
							on:click={handleSaveBook}
							class="btn-secondary text-lg px-8 py-4"
						>
							Save for Later
						</button>
					</div>
				</div>
			</div>

			<!-- Recommendations -->
			<div class="border-t border-gray-200 pt-12">
				<h2 class="text-2xl font-heading font-bold text-charcoal mb-6">
					If you liked this, you might enjoy...
				</h2>
				
				{#if isLoadingRecommendations}
					<div class="book-grid">
						<SkeletonLoader type="card" count={6} />
					</div>
				{:else if recommendedBooks.length > 0}
					<div class="book-grid">
						{#each recommendedBooks as recommendedBook (recommendedBook.id)}
							<BookCard
								book={recommendedBook}
								on:click={handleRecommendationClick}
								on:save={handleRecommendationSave}
								on:open={handleRecommendationOpen}
							/>
						{/each}
					</div>
				{:else}
					<div class="text-center py-8">
						<div class="text-4xl mb-3">🔍</div>
						<p class="text-charcoal opacity-75">
							No similar books found right now.
						</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>