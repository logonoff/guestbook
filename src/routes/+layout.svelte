<script lang="ts">
	let { children } = $props();
</script>

<svelte:head></svelte:head>

<main class="shale-v1-container">
	{@render children()}
</main>
