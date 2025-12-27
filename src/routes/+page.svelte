<script lang="ts">
	import type { PageProps } from './$types';

	const { data, form }: PageProps = $props();
</script>

<div class="shale-v1-flex-space-between">
	<small class="shale-v1-p">leave a message below :)</small>

	<button
		class="shale-v1-button"
		command="show-modal"
		commandfor="message-form"
		aria-haspopup="dialog"
	>
		send a message
	</button>
</div>

<dialog id="message-form" class="shale-v1-dialog">
	<header class="shale-v1-header shale-v1-header-compact">
		<div class="shale-v1-header-title"><p class="shale-v1-header-text">send a message</p></div>
		<menu class="shale-v1-caption-menu">
			<li>
				<button
					title="Close"
					type="button"
					commandfor="message-form"
					command="close"
					class="shale-v1-caption-button"
				>
					×
				</button>
			</li>
		</menu>
	</header>

	<form action="/" method="POST">
		<div class="shale-v1-container">
			<div class="shale-v1-flex-form">
				<div class="shale-v1-input">
					<input type="text" id="name" name="name" placeholder="name (required)" required />
				</div>

				<div class="shale-v1-input">
					<input type="email" id="email" name="email" placeholder="email (required)" required />
				</div>
			</div>

			<div class="shale-v1-input">
				<textarea
					id="message"
					name="message"
					placeholder="your message here (required)"
					rows="4"
					required
					style="resize: vertical; width: 100%;"
				></textarea>
			</div>
		</div>

		<div class="shale-v1-flex-space-between shale-v1-command-bar shale-v1-command-bar-gutter">
			<input type="submit" value="submit" class="shale-v1-button shale-v1-flex-grow" />
			<button
				type="button"
				commandfor="message-form"
				command="close"
				class="shale-v1-button shale-v1-flex-grow"
			>
				cancel
			</button>
		</div>
	</form>
</dialog>

{#if form && form.success === true}
	<div class="shale-v1-note-tip">
		your message has been sent! it'll show up when i reply to it :)
	</div>
{:else if form && form.success === false}
	<div class="shale-v1-note-alert">
		there was an error submitting your message: {form.message}
	</div>
{/if}

{#if data.entries && data.entries.length > 0}
	{#each data.entries as entry (entry.timestamp)}
		<div class="shale-v1-card">
			<h3 class="shale-v1-h3">{entry.name}</h3>
			<p>{entry.message}</p>
			<small>sent on {new Date(entry.timestamp).toLocaleString()}</small>
			<hr />
			<p>my reply:</p>
			<p>{entry.reply}</p>
		</div>
	{/each}
{:else}
	<div class="shale-v1-note-info">no entries yet. be the first to send a message :)</div>
{/if}
