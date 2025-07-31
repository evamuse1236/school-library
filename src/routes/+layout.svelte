<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { sessionStore } from '$lib/stores/session';

	let isDyslexicFont = false;

	onMount(() => {
		// Load dyslexic font preference
		isDyslexicFont = localStorage.getItem('dyslexic-font') === 'true';
		
		// Apply font immediately if enabled
		if (isDyslexicFont) {
			document.body.classList.add('font-dyslexic');
		}
	});

	function toggleDyslexicFont() {
		isDyslexicFont = !isDyslexicFont;
		localStorage.setItem('dyslexic-font', isDyslexicFont.toString());
		
		if (isDyslexicFont) {
			document.body.classList.add('font-dyslexic');
		} else {
			document.body.classList.remove('font-dyslexic');
		}
	}

	$: if (typeof document !== 'undefined') {
		if (isDyslexicFont) {
			document.body.classList.add('font-dyslexic');
		} else {
			document.body.classList.remove('font-dyslexic');
		}
	}
</script>

<svelte:head>
	<link rel="preload" href="https://cdn.jsdelivr.net/npm/opendyslexic@1.0.3/opendyslexic-regular.woff2" as="font" type="font/woff2" crossorigin="anonymous">
</svelte:head>

<div class="min-h-screen bg-warm">
	<!-- Skip link for accessibility -->
	<a href="#main-content" class="skip-link">Skip to main content</a>
	
	<!-- Top Navigation -->
	{#if $page.route.id !== '/'}
		<nav class="bg-white shadow-sm border-b border-gray-100" aria-label="Main navigation">
			<div class="max-w-content mx-auto px-4 py-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-6">
						<a href="/" class="text-xl font-heading font-bold text-primary-teal hover:text-opacity-80 transition-colors">
							🌼 School Library
						</a>
						
						{#if $sessionStore.name}
							<div class="flex items-center space-x-4">
								<a href="/discover" class="text-charcoal hover:text-primary-teal transition-colors font-medium">
									Discover
								</a>
								<a href="/myshelf" class="text-charcoal hover:text-primary-teal transition-colors font-medium">
									My Shelf
								</a>
							</div>
						{/if}
					</div>
					
					<div class="flex items-center space-x-4">
						{#if $sessionStore.name}
							<span class="text-sm text-charcoal bg-accent-mist px-3 py-1 rounded-full">
								Hi, {$sessionStore.name}!
							</span>
						{/if}
						
						<!-- Dyslexia-friendly font toggle -->
						<button
							on:click={toggleDyslexicFont}
							class="text-sm text-charcoal hover:text-primary-teal transition-colors p-2 rounded-card focus:ring-2 focus:ring-focus-blue"
							aria-label={isDyslexicFont ? 'Switch to regular font' : 'Switch to dyslexia-friendly font'}
							title={isDyslexicFont ? 'Switch to regular font' : 'Switch to dyslexia-friendly font'}
						>
							{isDyslexicFont ? '📖' : '🔤'}
						</button>
					</div>
				</div>
			</div>
		</nav>
	{/if}
	
	<!-- Main Content -->
	<main id="main-content" class="flex-1">
		<slot />
	</main>
	
	<!-- Toast notifications area -->
	<div id="toast-container" class="fixed bottom-4 right-4 z-50" aria-live="polite" aria-atomic="true">
		<!-- Toasts will be dynamically inserted here -->
	</div>
</div>

<style>
	:global(.font-dyslexic) {
		font-family: 'OpenDyslexic', sans-serif !important;
	}
	
	:global(.font-dyslexic h1, .font-dyslexic h2, .font-dyslexic h3, .font-dyslexic h4, .font-dyslexic h5, .font-dyslexic h6) {
		font-family: 'OpenDyslexic', sans-serif !important;
	}
</style>