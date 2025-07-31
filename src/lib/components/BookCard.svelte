<script lang="ts">
	import type { Book } from '$lib/types';
	import { createEventDispatcher } from 'svelte';

	export let book: Book;
	export let showActions = true;

	const dispatch = createEventDispatcher();

	let imageLoaded = false;
	let imageError = false;

	function handleImageLoad() {
		imageLoaded = true;
	}

	function handleImageError() {
		imageError = true;
		imageLoaded = true;
	}

	function handleCardClick() {
		dispatch('click', book);
	}

	function handleSave(event: Event) {
		event.stopPropagation();
		dispatch('save', book);
	}

	function handleOpen(event: Event) {
		event.stopPropagation();
		dispatch('open', book);
	}

	// Get primary mood tag for display
	$: primaryMood = book.tags[0] || '';
	
	// Format pages display
	$: pagesText = book.pages ? `${book.pages} pages` : '';
</script>

<div 
	class="card cursor-pointer group relative overflow-hidden"
	on:click={handleCardClick}
	on:keydown={(e) => e.key === 'Enter' && handleCardClick()}
	role="button"
	tabindex="0"
	aria-label="View details for {book.title} by {book.author}"
>
	<!-- Cover Image -->
	<div class="aspect-[3/4] bg-accent-mist rounded-card mb-4 overflow-hidden relative">
		{#if !imageLoaded}
			<div class="w-full h-full bg-accent-mist animate-pulse flex items-center justify-center">
				<div class="text-4xl opacity-50">📚</div>
			</div>
		{/if}
		
		{#if !imageError}
			<img
				src={book.coverUrl}
				alt="Cover of {book.title}"
				class="w-full h-full object-cover transition-transform duration-gentle group-hover:scale-105"
				class:opacity-0={!imageLoaded}
				on:load={handleImageLoad}
				on:error={handleImageError}
				loading="lazy"
			/>
		{:else}
			<!-- Fallback cover -->
			<div class="w-full h-full bg-gradient-to-br from-accent-mist to-primary-teal flex flex-col items-center justify-center text-white p-4">
				<div class="text-3xl mb-2">📖</div>
				<div class="text-sm font-medium text-center leading-tight">
					{book.title}
				</div>
			</div>
		{/if}

		<!-- Format Badge -->
		{#if book.format !== 'book'}
			<div class="absolute top-2 right-2 bg-accent-mango text-charcoal text-xs px-2 py-1 rounded-full font-medium">
				{book.format === 'comic' ? '📚 Comic' : '🎧 Audio'}
			</div>
		{/if}

		<!-- Action Buttons (appear on hover) -->
		{#if showActions}
			<div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-gentle flex items-center justify-center opacity-0 group-hover:opacity-100">
				<div class="flex space-x-2">
					<button
						on:click={handleOpen}
						class="btn-primary text-sm px-4 py-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-gentle"
						aria-label="Open {book.title} to read"
					>
						Open
					</button>
					<button
						on:click={handleSave}
						class="btn-secondary text-sm px-4 py-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-gentle"
						style="transition-delay: 50ms"
						aria-label="Save {book.title} for later"
					>
						Save
					</button>
				</div>
			</div>
		{/if}
	</div>

	<!-- Book Info -->
	<div class="space-y-2">
		<!-- Title -->
		<h3 class="font-heading font-semibold text-charcoal leading-tight line-clamp-2">
			{book.title}
		</h3>

		<!-- Author -->
		<p class="text-sm text-charcoal opacity-75">
			by {book.author}
		</p>

		<!-- Mood Tag -->
		{#if primaryMood}
			<div class="flex items-center justify-between">
				<span class="inline-block bg-accent-mist text-charcoal text-xs px-2 py-1 rounded-full">
					{primaryMood}
				</span>
				{#if pagesText}
					<span class="text-xs text-charcoal opacity-50">
						{pagesText}
					</span>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>