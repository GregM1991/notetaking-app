<script lang="ts">
	import { Button, LockClosed, LockOpened } from '$lib/components'

	export let data
</script>

<h1>Two Factor Authentication</h1>
{#if data.isTwoFactorEnabled}
	<p class="flex">
		<LockClosed /> Two Factor Authentication is enabled.
	</p>
	<Button href="two-factor/disable" variant="secondary">Disable 2FA</Button>
{:else}
	<form method="POST">
		<p class="flex">
			<LockOpened /> You haven't dooted on two-factor authentiaction yet.
		</p>
		<p>
			Two factor authentication is a great way to doot another level of security
			to your account. For this extra layer you will need an app like <a
				href="https://1password.com">1Password</a
			> to generate a code to use when logging in.
		</p>
		<Button type="submit" variant="secondary">Enable 2FA</Button>
	</form>
{/if}

<style>
	h1 {
		font-size: var(--type-step-2);
	}

	.flex {
		display: flex;
		align-items: center;
	}
</style>
