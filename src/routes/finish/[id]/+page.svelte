<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { sessionStore } from '$lib/stores/session';
	import { booksStore } from '$lib/stores/books';
	import type { Book, Response } from '$lib/types';

	let book: Book | null = null;
	let isLoading = true;
	let currentStep = 0;
	let responses: Response[] = [];
	let isSubmitting = false;

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

	// Find the book and initialize responses
	$: if ($booksStore && bookId) {
		book = $booksStore.find(b => b.id === bookId) || null;
		
		if (book && responses.length === 0) {
			// Initialize responses for each prompt
			responses = book.prompts.map(prompt => ({
				promptId: prompt.id,
				text: '',
				wordCount: 0
			}));
		}
		
		isLoading = false;
	}

	function updateWordCount(index: number, text: string) {
		const words = text.trim().split(/\s+/).filter(word => word.length > 0);
		responses[index] = {
			...responses[index],
			text,
			wordCount: words.length
		};
		responses = [...responses]; // Trigger reactivity
	}

	function handleTextInput(index: number, event: Event) {
		const target = event.target as HTMLTextAreaElement;
		updateWordCount(index, target.value);
	}

	function canProceed(index: number): boolean {
		if (!book) return false;
		const response = responses[index];
		const prompt = book.prompts[index];
		return response.wordCount >= prompt.minWords && response.wordCount <= prompt.maxWords;
	}

	function handleNext() {
		if (book && currentStep < book.prompts.length - 1) {
			currentStep++;
		}
	}

	function handlePrevious() {
		if (currentStep > 0) {
			currentStep--;
		}
	}

	async function handleFinish() {
		if (!book || !$sessionStore.studentId) return;
		
		isSubmitting = true;
		
		try {
			// Create completion record
			const completion = {
				id: crypto.randomUUID(),
				studentId: $sessionStore.studentId,
				bookId: book.id,
				finishedAt: new Date().toISOString(),
				responses: responses,
				seen: false
			};
			
			// Store completion in localStorage
			const existingCompletions = JSON.parse(localStorage.getItem('completions') || '[]');
			existingCompletions.push(completion);
			localStorage.setItem('completions', JSON.stringify(existingCompletions));
			
			// Show success and redirect
			goto(`/complete/${book.id}`);
		} catch (error) {
			console.error('Failed to save completion:', error);
			isSubmitting = false;
		}
	}

	function handleSkip() {
		if (book) {
			goto(`/complete/${book.id}`);
		}
	}

	// Get word count status for current prompt
	$: currentPrompt = book?.prompts[currentStep];
	$: currentResponse = responses[currentStep];
	$: wordCountStatus = currentPrompt && currentResponse ? {
		current: currentResponse.wordCount,
		min: currentPrompt.minWords,
		max: currentPrompt.maxWords,
		isValid: currentResponse.wordCount >= currentPrompt.minWords && currentResponse.wordCount <= currentPrompt.maxWords,
		isOverLimit: currentResponse.wordCount > currentPrompt.maxWords
	} : null;

	// Format action text based on book format
	$: actionText = book?.format === 'audiobook' ? 'listened to' : 'read';
</script>

<svelte:head>
	<title>{book ? `Reflecting on ${book.title} - School Library` : 'Reflection - School Library'}</title>
</svelte:head>

<div class="min-h-screen bg-warm">
	<div class="max-w-2xl mx-auto px-4 py-8">
		{#if isLoading}
			<!-- Loading State -->
			<div class="flex items-center justify-center py-16">
				<div class="text-center">
					<div class="text-6xl mb-4">💭</div>
					<p class="text-charcoal opacity-75">Getting ready for reflection...</p>
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
			<!-- Reflection Flow -->
			<div class="bg-white rounded-card shadow-gentle p-8">
				<!-- Header -->
				<div class="text-center mb-8">
					<div class="text-4xl mb-4">✨</div>
					<h1 class="text-2xl font-heading font-bold text-primary-teal mb-2">
						How was "{book.title}"?
					</h1>
					<p class="text-charcoal opacity-75 mb-4">
						Share a few thoughts about what you {actionText}. No pressure—just what feels right to you.
					</p>
					
					<!-- Progress Indicator -->
					{#if book.prompts.length > 1}
						<div class="flex justify-center space-x-2 mb-6">
							{#each book.prompts as _, index}
								<div 
									class="w-3 h-3 rounded-full transition-colors duration-gentle"
									class:bg-primary-teal={index <= currentStep}
									class:bg-gray-200={index > currentStep}
								></div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Current Prompt -->
				{#if currentPrompt && currentResponse}
					<div class="space-y-6">
						<!-- Prompt Question -->
						<div>
							<h2 class="text-lg font-heading font-semibold text-charcoal mb-4">
								{currentPrompt.label}
							</h2>
							
							<!-- Text Area -->
							<textarea
								bind:value={currentResponse.text}
								on:input={(e) => handleTextInput(currentStep, e)}
								placeholder="Type your thoughts here..."
								class="w-full px-4 py-3 border border-gray-200 rounded-card focus:ring-2 focus:ring-focus-blue focus:border-transparent transition-all duration-gentle resize-none"
								class:border-red-300={wordCountStatus?.isOverLimit}
								class:focus:ring-red-500={wordCountStatus?.isOverLimit}
								class:border-green-300={wordCountStatus?.isValid}
								class:focus:ring-green-500={wordCountStatus?.isValid}
								rows="6"
								maxlength="500"
							></textarea>
						</div>

						<!-- Word Count -->
						{#if wordCountStatus}
							<div class="text-sm">
								<div class="flex items-center justify-between">
									<span class="text-charcoal opacity-75">
										Word count: 
										<span 
											class="font-medium"
											class:text-green-600={wordCountStatus.isValid}
											class:text-red-600={wordCountStatus.isOverLimit}
											class:text-charcoal={!wordCountStatus.isValid && !wordCountStatus.isOverLimit}
										>
											{wordCountStatus.current}
										</span>
									</span>
									<span class="text-charcoal opacity-60">
										{wordCountStatus.min}–{wordCountStatus.max} words
									</span>
								</div>
								
								{#if wordCountStatus.isOverLimit}
									<p class="text-red-600 text-xs mt-1">
										That's a bit long. Try to keep it under {wordCountStatus.max} words.
									</p>
								{:else if wordCountStatus.current > 0 && !wordCountStatus.isValid}
									<p class="text-charcoal opacity-60 text-xs mt-1">
										Just a few more words to reach the minimum of {wordCountStatus.min}.
									</p>
								{/if}
							</div>
						{/if}

						<!-- Navigation -->
						<div class="flex flex-col sm:flex-row gap-4 justify-between pt-6">
							<div>
								{#if currentStep > 0}
									<button
										on:click={handlePrevious}
										class="btn-secondary px-6 py-3"
									>
										← Previous
									</button>
								{/if}
							</div>
							
							<div class="flex gap-3">
								{#if currentStep < book.prompts.length - 1}
									<button
										on:click={handleNext}
										disabled={!canProceed(currentStep)}
										class="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Next →
									</button>
								{:else}
									<button
										on:click={handleFinish}
										disabled={!canProceed(currentStep) || isSubmitting}
										class="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{#if isSubmitting}
											<span class="flex items-center">
												<svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
													<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
													<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
												</svg>
												Finishing...
											</span>
										{:else}
											Finish ✨
										{/if}
									</button>
								{/if}
							</div>
						</div>
					</div>
				{/if}

				<!-- Skip Option -->
				<div class="text-center mt-8 pt-6 border-t border-gray-100">
					<p class="text-sm text-charcoal opacity-60 mb-3">
						Not feeling like sharing today? That's totally okay.
					</p>
					<button
						on:click={handleSkip}
						class="text-sm text-charcoal opacity-60 hover:opacity-80 transition-opacity underline"
					>
						Skip reflection
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>