<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { sessionStore } from '$lib/stores/session';
	import { booksStore } from '$lib/stores/books';
	import type { Book } from '$lib/types';

	let book: Book | null = null;
	let isLoading = true;
	let showConfetti = false;

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
		
		// Start confetti animation after a short delay
		setTimeout(() => {
			showConfetti = true;
		}, 500);
		
		return unsubscribe;
	});

	// Find the book
	$: if ($booksStore && bookId) {
		book = $booksStore.find(b => b.id === bookId) || null;
		isLoading = false;
	}

	function handleDiscoverMore() {
		goto('/discover');
	}

	function handleMyShelf() {
		goto('/myshelf');
	}

	// Format action text based on book format
	$: actionText = book?.format === 'audiobook' ? 'listening to' : 'reading';
</script>

<svelte:head>
	<title>{book ? `Completed ${book.title} - School Library` : 'Reading Complete - School Library'}</title>
</svelte:head>

<div class="min-h-screen bg-warm relative overflow-hidden">
	<!-- Confetti Animation -->
	{#if showConfetti}
		<div class="confetti-container">
			{#each Array(20) as _, i}
				<div 
					class="confetti-piece confetti-{i % 4}"
					style="left: {Math.random() * 100}%; animation-delay: {Math.random() * 3}s;"
				></div>
			{/each}
		</div>
	{/if}

	<div class="max-w-2xl mx-auto px-4 py-8 relative z-10">
		{#if isLoading}
			<!-- Loading State -->
			<div class="flex items-center justify-center py-16">
				<div class="text-center">
					<div class="text-6xl mb-4">✨</div>
					<p class="text-charcoal opacity-75">Celebrating your reading...</p>
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
			<!-- Completion Celebration -->
			<div class="bg-white rounded-card shadow-gentle p-8 text-center">
				<!-- Success Icon -->
				<div class="text-6xl mb-6 animate-bounce-gentle">🌟</div>
				
				<!-- Congratulations -->
				<h1 class="text-3xl font-heading font-bold text-primary-teal mb-4">
					Well done, {$sessionStore.name}!
				</h1>
				
				<p class="text-lg text-charcoal mb-6">
					Thank you for {actionText} "{book.title}" and sharing your thoughts.
				</p>
				
				<!-- Gentle Encouragement -->
				<div class="bg-accent-mist rounded-card p-6 mb-8">
					<div class="text-3xl mb-3">🌱</div>
					<p class="text-charcoal">
						Every story you read helps you grow. You're building something wonderful—
						a love of reading that will last forever.
					</p>
				</div>
				
				<!-- Action Buttons -->
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<button
						on:click={handleDiscoverMore}
						class="btn-primary text-lg px-8 py-4"
					>
						Discover More Stories
					</button>
					<button
						on:click={handleMyShelf}
						class="btn-secondary px-6 py-4"
					>
						View My Shelf
					</button>
				</div>
				
				<!-- Gentle Reminder -->
				<div class="mt-8 pt-6 border-t border-gray-100">
					<p class="text-sm text-charcoal opacity-60">
						Your reading journey is saved on this device. Come back anytime to continue exploring! 📚
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.confetti-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 5;
	}

	.confetti-piece {
		position: absolute;
		width: 8px;
		height: 8px;
		animation: confetti-fall 6s linear infinite;
		opacity: 0.8;
	}

	.confetti-0 {
		background-color: #FFC266;
		border-radius: 50%;
	}

	.confetti-1 {
		background-color: #1F6F78;
		border-radius: 2px;
	}

	.confetti-2 {
		background-color: #E8F4F8;
		border-radius: 50%;
	}

	.confetti-3 {
		background-color: #8FBC8F;
		border-radius: 2px;
	}

	@keyframes confetti-fall {
		0% {
			transform: translateY(-100vh) rotate(0deg);
			opacity: 1;
		}
		100% {
			transform: translateY(100vh) rotate(360deg);
			opacity: 0;
		}
	}

	.animate-bounce-gentle {
		animation: bounce-gentle 2s ease-in-out infinite;
	}

	@keyframes bounce-gentle {
		0%, 20%, 53%, 80%, 100% {
			transform: translateY(0);
		}
		40%, 43% {
			transform: translateY(-8px);
		}
		70% {
			transform: translateY(-4px);
		}
		90% {
			transform: translateY(-2px);
		}
	}
</style>