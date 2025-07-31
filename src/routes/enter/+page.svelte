<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { sessionStore } from '$lib/stores/session';

	let name = '';
	let selectedClass = '';
	let isSubmitting = false;
	let nameError = '';

	// Mock class options (can be customized per school)
	const classOptions = [
		'Grade 1',
		'Grade 2', 
		'Grade 3',
		'Grade 4',
		'Grade 5',
		'Grade 6',
		'Year 7',
		'Year 8'
	];

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

	function validateName(value: string): string {
		if (!value.trim()) {
			return 'Please tell us your name so we can say hello!';
		}
		if (value.trim().length < 2) {
			return 'Your name seems a bit short. Can you check it?';
		}
		if (value.trim().length > 50) {
			return 'That\'s quite a long name! Can you use a shorter version?';
		}
		return '';
	}

	function handleNameInput(event: Event) {
		const target = event.target as HTMLInputElement;
		name = target.value;
		nameError = '';
	}

	function handleSubmit() {
		const trimmedName = name.trim();
		const error = validateName(trimmedName);
		
		if (error) {
			nameError = error;
			return;
		}

		isSubmitting = true;
		
		// Create session
		try {
			sessionStore.create(trimmedName, selectedClass || undefined);
			goto('/discover');
		} catch (error) {
			console.error('Failed to create session:', error);
			nameError = 'Something went wrong. Please try again.';
			isSubmitting = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSubmit();
		}
	}

	// Truncate display name if too long (as per spec)
	$: displayName = name.length > 22 ? name.slice(0, 22) + '...' : name;
</script>

<svelte:head>
	<title>What's your name? - School Library</title>
</svelte:head>

<div class="min-h-screen bg-warm flex items-center justify-center px-4">
	<div class="max-w-md mx-auto">
		<div class="bg-white rounded-card shadow-gentle p-8">
			<!-- Header -->
			<div class="text-center mb-8">
				<h1 class="text-2xl font-heading font-bold text-primary-teal mb-2">
					What's your name?
				</h1>
				<p class="text-charcoal opacity-75">
					We'll use this to say hello and keep track of your reading journey.
				</p>
			</div>

			<!-- Form -->
			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<!-- Name Input -->
				<div>
					<label for="student-name" class="block text-sm font-medium text-charcoal mb-2">
						Your name <span class="text-red-500">*</span>
					</label>
					<input
						id="student-name"
						type="text"
						bind:value={name}
						on:input={handleNameInput}
						on:keypress={handleKeyPress}
						placeholder="Type your name here"
						class="w-full px-4 py-3 border border-gray-200 rounded-card focus:ring-2 focus:ring-focus-blue focus:border-transparent transition-all duration-gentle"
						class:border-red-300={nameError}
						class:focus:ring-red-500={nameError}
						disabled={isSubmitting}
						autocomplete="given-name"
						maxlength="50"
						required
					/>
					{#if nameError}
						<p class="mt-2 text-sm text-red-600" role="alert" aria-live="polite">
							{nameError}
						</p>
					{/if}
					{#if name && !nameError}
						<p class="mt-2 text-sm text-primary-teal">
							Hi, {displayName}! 👋
						</p>
					{/if}
				</div>

				<!-- Class Selection (Optional) -->
				<div>
					<label for="student-class" class="block text-sm font-medium text-charcoal mb-2">
						Class or Grade <span class="text-gray-400">(optional)</span>
					</label>
					<select
						id="student-class"
						bind:value={selectedClass}
						class="w-full px-4 py-3 border border-gray-200 rounded-card focus:ring-2 focus:ring-focus-blue focus:border-transparent transition-all duration-gentle"
						disabled={isSubmitting}
					>
						<option value="">Choose your class (optional)</option>
						{#each classOptions as classOption}
							<option value={classOption}>{classOption}</option>
						{/each}
					</select>
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={isSubmitting || !name.trim()}
					class="w-full btn-primary py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
					aria-label="Continue to discover books"
				>
					{#if isSubmitting}
						<span class="flex items-center justify-center">
							<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Getting ready...
						</span>
					{:else}
						Continue
					{/if}
				</button>
			</form>

			<!-- Privacy Note -->
			<div class="mt-6 text-center">
				<p class="text-xs text-charcoal opacity-60">
					We only store your name locally on this device. No personal information is shared.
				</p>
			</div>
		</div>

		<!-- Back Link -->
		<div class="text-center mt-6">
			<a 
				href="/" 
				class="text-sm text-charcoal hover:text-primary-teal transition-colors underline"
			>
				← Back to home
			</a>
		</div>
	</div>
</div>