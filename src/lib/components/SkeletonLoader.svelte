<script lang="ts">
	export let type: 'card' | 'text' | 'button' = 'card';
	export let width: 'full' | 'short' | 'medium' = 'full';
	export let count: number = 1;
</script>

{#if type === 'card'}
	{#each Array(count) as _, i}
		<div class="skeleton-card-container">
			<!-- Book Cover Skeleton -->
			<div class="skeleton skeleton-card"></div>
			
			<!-- Book Info Skeleton -->
			<div class="space-y-2 mt-4">
				<!-- Title -->
				<div class="skeleton skeleton-text"></div>
				<div class="skeleton skeleton-text short"></div>
				
				<!-- Author -->
				<div class="skeleton skeleton-text medium"></div>
				
				<!-- Tags and Pages -->
				<div class="flex justify-between items-center mt-3">
					<div class="skeleton skeleton-text short"></div>
					<div class="skeleton skeleton-text short"></div>
				</div>
			</div>
		</div>
	{/each}
{:else if type === 'text'}
	{#each Array(count) as _, i}
		<div class="skeleton skeleton-text {width}"></div>
	{/each}
{:else if type === 'button'}
	{#each Array(count) as _, i}
		<div class="skeleton h-12 w-32 rounded-card"></div>
	{/each}
{/if}

<style>
	.skeleton-card-container {
		animation: fade-in 0.3s ease-out;
	}
</style>