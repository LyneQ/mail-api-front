<script lang="ts">
 import { page } from '$app/state';
 import Folders from '../../../lib/components/mail/Folders.svelte';
 import InboxMessages from '../../../lib/components/mail/InboxMessages.svelte';

	let { data } = $props();
	let isLoading = $state(true);
	let currentFolderPath = $state('');
	let accountFolders = $state<string[]>([]);
	let inboxMessages = $state([]);
	let mailBox = $state(null);


	async function fetchData(folderPath: string) {
		isLoading = true;
		try {
			// Fetch folders
			const inboxResponse = await fetch(`http://localhost:1323/api/email/inbox`, {
				method: 'GET',
				credentials: 'include'
			});

			if (inboxResponse.status === 200) {
				const body = await inboxResponse.json();
				accountFolders = [];

				if (body && body.folders && Array.isArray(body.folders)) {
					const foldersWithPrefix = body.folders.filter((folder: string) => folder.startsWith('Folders/'));

					if (foldersWithPrefix.length > 0) {
						const filteredFolders = foldersWithPrefix.map((folder: string) => folder.replace('Folders/', ''));
						accountFolders.push(...filteredFolders);
					} else {
						accountFolders.push(...body.folders);
					}
				}
			} else {
				console.log('API request failed with status:', inboxResponse.status);
			}
			const folderName = folderPath === "inbox" ? "Inbox" : `Folders/${folderPath}`;
			const messagesResponse = await fetch(`http://localhost:1323/api/email/folder?name=${folderName}`, {
				method: 'GET',
				credentials: 'include'
			});

			if (messagesResponse.status === 200) {
				const messages = await messagesResponse.json();
				inboxMessages = messages || [];
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
			{#if accountFolders.length > 0}
				<Folders folders={accountFolders} />
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
