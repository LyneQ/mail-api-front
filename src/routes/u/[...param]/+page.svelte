<script lang="ts">
	import { page } from '$app/state';
	import Folders from '../../../lib/components/mail/Folders.svelte';
	import InboxMessages from '../../../lib/components/mail/InboxMessages.svelte';
	import { config } from '$lib/stores/config';
	import { get } from 'svelte/store';

	let { data } = $props();
	let isLoading = $state(true);
	let currentFolderPath = $state('');
	let specialFolders = $state<string[]>([]);
	let regularFolders = $state<string[]>([]);
	let inboxMessages = $state([]);
	let mailBox = $state(null);

	const { apiUrl } = get(config);


	async function fetchData(folderPath: string) {
		isLoading = true;
		try {

			const inboxResponse = await fetch(`${apiUrl}email/inbox`, {
				method: 'GET',
				credentials: 'include'
			});

			if (inboxResponse.status === 200) {
				const body = await inboxResponse.json();


				specialFolders = ['inbox', 'sent', 'drafts', 'trash', 'spam', 'All Mail'];


				regularFolders = [];
				if (body && body.folders && Array.isArray(body.folders)) {
					const foldersWithPrefix = body.folders.filter((folder: string) => folder.startsWith('Folders/'));

					if (foldersWithPrefix.length > 0) {
						regularFolders = foldersWithPrefix.map((folder: string) => folder.replace('Folders/', ''));
					} else {
						regularFolders = body.folders;
					}
				}
			} else {
				console.log('API request failed with status:', inboxResponse.status);
			}

			const specialFoldersList = ['inbox', 'sent', 'drafts', 'trash', 'spam', 'all mail'];
			const folderName = specialFoldersList.includes(folderPath.toLowerCase()) 
				? folderPath.charAt(0).toUpperCase() + folderPath.slice(1)
				: `Folders/${folderPath}`;
			const messagesResponse = await fetch(`${apiUrl}email/folder?name=${folderName}`, {
				method: 'GET',
				credentials: 'include'
			});

			if (messagesResponse.status === 200) {
				const messagesData = await messagesResponse.json();

				if (messagesData && typeof messagesData === 'object') {
					if ('messages' in messagesData) {
						inboxMessages = messagesData.messages || [];
					} else if ('data' in messagesData) {
						inboxMessages = messagesData.data || [];
					} else {
						inboxMessages = messagesData || [];
					}
				} else {
					inboxMessages = messagesData || [];
				}
			}
		} catch (err) {
			console.log("error");
			console.log(err);
		}
		isLoading = false;
	}

	$effect(() => {
		const param = page.params.param.split('/');
		const newFolderPath = param.slice(1).join('/');


		if (newFolderPath !== currentFolderPath) {
			currentFolderPath = newFolderPath;
			if (newFolderPath) {
				fetchData(newFolderPath);
			}
		}
	});
</script>

<div class="mail-container">
	{#if !isLoading}
		<div class="sidebar">
			{#if specialFolders.length > 0 || regularFolders.length > 0}
				<Folders specialFolders={specialFolders} regularFolders={regularFolders} />
			{:else}
				<div class="empty-folders">No folders found</div>
			{/if}
		</div>
		<div class="content">
			<InboxMessages messages={inboxMessages} />
		</div>
	{:else}
		<div class="loading">Loading...</div>
	{/if}
</div>

<style lang="scss">
	.mail-container {
		display: flex;
		width: 100%;
		height: calc(100vh - 4.3rem);
	}

	.sidebar {
		flex: 0 0 20%;
	}

	.content {
		flex: 1;
		overflow-y: auto;
	}

	.loading, .empty-folders {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		font-size: 1.2rem;
	}

	.empty-folders {
		color: #888;
		font-style: italic;
	}
</style>
