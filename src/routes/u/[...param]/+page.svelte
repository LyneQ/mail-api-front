<script lang="ts">
	import { page } from '$app/state';
	import Folders from '@/components/mail/Folders.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	let isLoading = $state(true);
	const param = page.params.param.split('/');

	const accountFolders: string[] = [];
	const inboxMessages = [];

	function handleSelect(event: CustomEvent<{ path: string }>) {
		console.log('Dossier sélectionné :', event.detail.path);
	}

	onMount(async () => {
		try {
			const response = await fetch(`http://localhost:1323/api/email/inbox`, {
				method: 'GET',
				credentials: 'include'
			});

			if (response.status === 200) {
				const body = await response.json();
				const filteredFolders = body?.folders.filter((folder: string) => folder.startsWith('Folders/')).map((folder: string) => folder.replace('Folders/', ''));
				accountFolders.push(...filteredFolders);
				inboxMessages.push(...body?.inbox);
			}

			console.log(response);
		} catch (err) {
			console.log("error");
			console.log(err);
		}
		isLoading = false;
	});
</script>

<div>
	{#if !isLoading}
		<Folders folders={accountFolders} on:select={handleSelect} />
	{/if}
</div>

