<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { sessionStore } from '$lib/stores/session';

	onMount(() => {
		// Initialize session store
		sessionStore.init();
		
		// If user already has a session, redirect to discover
		const unsubscribe = sessionStore.subscribe(session => {
			if (session.name) {
				goto('/discover');
			}
		});
		
		return unsubscribe;
	});
</script>

<svelte:head>
	<title>School Library - Find a story that feels like you</title>
	<meta name="description" content="A gentle digital library for children to discover stories they'll love. No sign-ups, no pressure - just pure reading joy." />
</svelte:head>

<div class="min-h-screen bg-warm flex items-center justify-center px-4">
	<div class="max-w-2xl mx-auto text-center">
		<!-- Main Headline (exact from spec) -->
		<h1 class="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-teal mb-6 leading-tight">
			Find a story that feels like you.
		</h1>
		
		<!-- Subtitle -->
		<p class="text-lg md:text-xl text-charcoal mb-8 leading-relaxed max-w-lg mx-auto">
			Browse, read, and leave a tiny note about what it made you feel. No sign-ups—just your name.
		</p>
		
		<!-- Call to Action -->
		<div class="space-y-4">
			<a 
				href="/enter" 
				class="btn-primary inline-block text-lg px-8 py-4 rounded-card font-medium transition-all duration-gentle hover:scale-105 focus:scale-105"
				aria-label="Start your reading journey"
			>
				Start Reading
			</a>
			
			<p class="text-sm text-charcoal opacity-75">
				No passwords • No email • Just stories
			</p>
		</div>
		
		<!-- Decorative Elements -->
		<div class="mt-16 flex justify-center space-x-8 opacity-60">
			<div class="text-4xl animate-bounce" style="animation-delay: 0s;">📚</div>
			<div class="text-4xl animate-bounce" style="animation-delay: 0.2s;">✨</div>
			<div class="text-4xl animate-bounce" style="animation-delay: 0.4s;">🌟</div>
			<div class="text-4xl animate-bounce" style="animation-delay: 0.6s;">📖</div>
		</div>
		
		<!-- Gentle Features -->
		<div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
			<div class="text-center p-6">
				<div class="text-3xl mb-3">🎯</div>
				<h3 class="font-heading font-semibold text-charcoal mb-2">Find Your Mood</h3>
				<p class="text-sm text-charcoal opacity-75">
					Funny, magical, thinky, or adventurous—discover books that match how you feel.
				</p>
			</div>
			
			<div class="text-center p-6">
				<div class="text-3xl mb-3">💭</div>
				<h3 class="font-heading font-semibold text-charcoal mb-2">Share Your Thoughts</h3>
				<p class="text-sm text-charcoal opacity-75">
					Leave tiny, ungraded reflections about what the story made you feel.
				</p>
			</div>
			
			<div class="text-center p-6">
				<div class="text-3xl mb-3">🌱</div>
				<h3 class="font-heading font-semibold text-charcoal mb-2">Grow at Your Pace</h3>
				<p class="text-sm text-charcoal opacity-75">
					No pressure, no comparisons—just the joy of discovering great stories.
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes bounce {
		0%, 20%, 53%, 80%, 100% {
			transform: translateY(0);
		}
		40%, 43% {
			transform: translateY(-10px);
		}
		70% {
			transform: translateY(-5px);
		}
		90% {
			transform: translateY(-2px);
		}
	}
	
	.animate-bounce {
		animation: bounce 3s ease-in-out infinite;
	}
</style>