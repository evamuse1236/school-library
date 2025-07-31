<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { sessionStore } from '$lib/stores/session';
	import { booksStore } from '$lib/stores/books';
	import type { Book } from '$lib/types';

	let book: Book | null = null;
	let isLoading = true;
	let showInstructions = true;

	$: bookId = $page.params.id;

	onMount(() => {
		// Initialize session store
		sessionStore.init();
		
		// Redirect if no session
		const unsubscribe = sessionStore.subscribe(session => {
			if (!session.name) {
				goto('/enter');
			}
		});
		
		return unsubscribe;
	});

	// Find the book
	$: if ($booksStore && bookId) {
		book = $booksStore.find(b => b.id === bookId) || null;
		isLoading = false;
	}

	function handleStartReading() {
		if (book) {
			// Open the book in a new tab/window
			window.open(book.driveUrl, '_blank');
			
			// Show completion flow after a short delay
			setTimeout(() => {
				if (book) {
					goto(`/finish/${book.id}`);
				}
			}, 2000);
		}
	}

	function handleGoBack() {
		if (book) {
			goto(`/book/${book.id}`);
		} else {
			goto('/discover');
		}
	}

	function handleDismissInstructions() {
		showInstructions = false;
	}

	// Format display text
	$: formatText = book?.format === 'comic' ? 'comic' : book?.format === 'audiobook' ? 'audiobook' : 'book';
	$: actionText = book?.format === 'audiobook' ? 'listen to' : 'read';
</script>

<svelte:head>
	<title>{book ? `Reading ${book.title} - School Library` : 'Reading - School Library'}</title>
</svelte:head>

<div class="min-h-screen bg-warm">
	<div class="max-w-2xl mx-auto px-4 py-8">
		{#if isLoading}
			<!-- Loading State -->
			<div class="flex items-center justify-center py-16">
				<div class="text-center">
					<div class="text-6xl mb-4">📚</div>
					<p class="text-charcoal opacity-75">Getting your book ready...</p>
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
			<!-- Reading Instructions -->
			{#if showInstructions}
				<div class="bg-white rounded-card shadow-gentle p-8 mb-8">
					<div class="text-center mb-6">
						<div class="text-4xl mb-4">🌟</div>
						<h1 class="text-2xl font-heading font-bold text-primary-teal mb-2">
							Ready to {actionText} "{book.title}"?
						</h1>
						<p class="text-charcoal opacity-75">
							by {book.author}
						</p>
					</div>

					<div class="space-y-4 mb-8">
						<div class="bg-accent-mist rounded-card p-4">
							<h3 class="font-heading font-semibold text-charcoal mb-2">
								📖 How it works
							</h3>
							<p class="text-sm text-charcoal opacity-75">
								We'll open your {formatText} in a new window. Take your time—there's no rush and no timer. 
								{book.format === 'audiobook' ? 'Listen' : 'Read'} at your own pace and enjoy the story.
							</p>
						</div>

						<div class="bg-accent-mist rounded-card p-4">
							<h3 class="font-heading font-semibold text-charcoal mb-2">
								💭 When you're done
							</h3>
							<p class="text-sm text-charcoal opacity-75">
								Come back here and we'll ask you to share a few thoughts about what you {actionText}. 
								It's just for you—no grades, no pressure.
							</p>
						</div>

						<div class="bg-accent-mist rounded-card p-4">
							<h3 class="font-heading font-semibold text-charcoal mb-2">
								🌱 Trust-based reading
							</h3>
							<p class="text-sm text-charcoal opacity-75">
								We trust you to {actionText} as much or as little as feels right. Even if you only {actionText} a few pages, 
								that's perfectly okay—every bit of reading counts.
							</p>
						</div>
					</div>

					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<button
							on:click={handleStartReading}
							class="btn-primary text-lg px-8 py-4"
						>
							Open {book.format === 'audiobook' ? 'Audiobook' : 'Book'} ✨
						</button>
						<button
							on:click={handleGoBack}
							class="btn-secondary px-6 py-4"
						>
							← Go Back
						</button>
					</div>

					<div class="text-center mt-6">
						<button
							on:click={handleDismissInstructions}
							class="text-sm text-charcoal opacity-60 hover:opacity-80 transition-opacity underline"
						>
							Skip instructions next time
						</button>
					</div>
				</div>
			{:else}
				<!-- Quick Start -->
				<div class="bg-white rounded-card shadow-gentle p-8 text-center">
					<div class="text-4xl mb-4">📚</div>
					<h1 class="text-2xl font-heading font-bold text-primary-teal mb-4">
						{book.title}
					</h1>
					<p class="text-charcoal opacity-75 mb-8">
						by {book.author}
					</p>

					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<button
							on:click={handleStartReading}
							class="btn-primary text-lg px-8 py-4"
						>
							Start {book.format === 'audiobook' ? 'Listening' : 'Reading'} ✨
						</button>
						<button
							on:click={handleGoBack}
							class="btn-secondary px-6 py-4"
						>
							← Go Back
						</button>
					</div>

					<div class="text-center mt-6">
						<button
							on:click={() => showInstructions = true}
							class="text-sm text-charcoal opacity-60 hover:opacity-80 transition-opacity underline"
						>
							Show instructions
						</button>
					</div>
				</div>
			{/if}

			<!-- Gentle Reminder -->
			<div class="text-center mt-8">
				<p class="text-sm text-charcoal opacity-60">
					Remember: There's no pressure to finish everything. {book.format === 'audiobook' ? 'Listen' : 'Read'} what feels good to you. 🌱
				</p>
			</div>
		{/if}
	</div>
</div>