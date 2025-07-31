<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { sessionStore } from '$lib/stores/session';
	import { filteredBooks, filterStore, filterActions, getRandomBook } from '$lib/stores/books';
	import { favoritesStore } from '$lib/stores/favorites';
	import BookCard from '$lib/components/BookCard.svelte';
	import SkeletonLoader from '$lib/components/SkeletonLoader.svelte';
	import type { MoodTag, BookFormat, SortOption } from '$lib/types';

	let searchInput = '';
	let isLoading = true;

	// Mood options from spec
	const moodOptions: MoodTag[] = ['Funny', 'Adventure', 'Magical', 'Thinky', 'True Stories', 'Short Reads'];
	
	// Format options
	const formatOptions: { value: BookFormat; label: string }[] = [
		{ value: 'book', label: 'Books' },
		{ value: 'comic', label: 'Comics' },
		{ value: 'audiobook', label: 'Audiobooks' }
	];

	// Sort options
	const sortOptions: { value: SortOption; label: string }[] = [
		{ value: 'new', label: 'New' },
		{ value: 'popular', label: 'Popular' },
		{ value: 'a-z', label: 'A–Z' },
		{ value: 'under-100', label: 'Under 100 pages' }
	];

	onMount(() => {
		// Initialize session store
		sessionStore.init();
		
		// Simulate loading delay for demonstration
		setTimeout(() => {
			isLoading = false;
		}, 800);
		
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

	// Handle search input with debouncing
	let searchTimeout: ReturnType<typeof setTimeout>;
	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		searchInput = target.value;
		
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			filterActions.setSearch(searchInput);
		}, 300);
	}

	function handleMoodToggle(mood: MoodTag) {
		filterActions.toggleMood(mood);
	}

	function handleFormatToggle(format: BookFormat) {
		filterActions.toggleFormat(format);
	}

	function handleSortChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		filterActions.setSort(target.value as SortOption);
	}

	function handleSurpriseMe() {
		const randomBook = getRandomBook();
		goto(`/book/${randomBook.id}`);
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
				showToast('Removed from your shelf', 'info');
			} else {
				favoritesStore.addToFavorites(book.id, $sessionStore.studentId);
				showToast('Added to your shelf. Come back anytime.', 'success');
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

	// Clear all filters
	function handleClearFilters() {
		searchInput = '';
		filterActions.clearFilters();
	}
</script>

<svelte:head>
	<title>Discover Books - School Library</title>
</svelte:head>

<div class="min-h-screen bg-warm">
	<div class="max-w-content mx-auto px-4 py-8">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-3xl font-heading font-bold text-primary-teal mb-2">
				Discover
			</h1>
			<p class="text-charcoal opacity-75">
				What are you in the mood for—funny, fast, or magical?
			</p>
		</div>

		<!-- Filters Section -->
		<div class="bg-white rounded-card shadow-gentle p-6 mb-8">
			<!-- Search Bar -->
			<div class="mb-6">
				<label for="search" class="sr-only">Search books</label>
				<div class="relative">
					<input
						id="search"
						type="text"
						bind:value={searchInput}
						on:input={handleSearchInput}
						placeholder="Search books, authors, or topics..."
						class="w-full px-4 py-3 pl-10 border border-gray-200 rounded-card focus:ring-2 focus:ring-focus-blue focus:border-transparent transition-all duration-gentle"
					/>
					<div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
						🔍
					</div>
				</div>
			</div>

			<!-- Mood Chips -->
			<div class="mb-6">
				<h3 class="text-sm font-medium text-charcoal mb-3">Mood</h3>
				<div class="flex flex-wrap gap-2">
					{#each moodOptions as mood}
						<button
							class="mood-chip"
							class:active={$filterStore.moods.includes(mood)}
							on:click={() => handleMoodToggle(mood)}
							aria-pressed={$filterStore.moods.includes(mood)}
						>
							{mood}
						</button>
					{/each}
				</div>
			</div>

			<!-- Format and Sort Filters -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<!-- Format Filters -->
				<div>
					<h3 class="text-sm font-medium text-charcoal mb-3">Format</h3>
					<div class="flex flex-wrap gap-2">
						{#each formatOptions as format}
							<button
								class="mood-chip"
								class:active={$filterStore.formats.includes(format.value)}
								on:click={() => handleFormatToggle(format.value)}
								aria-pressed={$filterStore.formats.includes(format.value)}
							>
								{format.label}
							</button>
						{/each}
					</div>
				</div>

				<!-- Sort Options -->
				<div>
					<label for="sort" class="block text-sm font-medium text-charcoal mb-3">Sort by</label>
					<select
						id="sort"
						bind:value={$filterStore.sort}
						on:change={handleSortChange}
						class="w-full px-4 py-2 border border-gray-200 rounded-card focus:ring-2 focus:ring-focus-blue focus:border-transparent transition-all duration-gentle"
					>
						{#each sortOptions as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-wrap gap-3">
				<button
					on:click={handleSurpriseMe}
					class="btn-secondary"
				>
					✨ Surprise me
				</button>
				
				<button
					on:click={handleClearFilters}
					class="text-sm text-charcoal hover:text-primary-teal transition-colors px-4 py-2"
				>
					Clear filters
				</button>
			</div>
		</div>

		<!-- Results -->
		<div class="mb-6">
			<p class="text-sm text-charcoal opacity-75">
				{$filteredBooks.length} {$filteredBooks.length === 1 ? 'book' : 'books'} found
			</p>
		</div>

		<!-- Books Grid -->
		{#if isLoading}
			<div class="book-grid">
				<SkeletonLoader type="card" count={12} />
			</div>
		{:else if $filteredBooks.length > 0}
			<div class="book-grid">
				{#each $filteredBooks as book (book.id)}
					<BookCard
						{book}
						on:click={handleBookClick}
						on:save={handleBookSave}
						on:open={handleBookOpen}
					/>
				{/each}
			</div>
		{:else}
			<!-- Empty State -->
			<div class="text-center py-16">
				<div class="text-6xl mb-4">📚</div>
				<h3 class="text-xl font-heading font-semibold text-charcoal mb-2">
					Hmm, nothing matches…
				</h3>
				<p class="text-charcoal opacity-75 mb-6">
					Want a Surprise me?
				</p>
				<button
					on:click={handleSurpriseMe}
					class="btn-primary"
				>
					✨ Surprise me
				</button>
			</div>
		{/if}
	</div>
</div>