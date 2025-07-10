<script lang="ts">
 import FolderNode from './FolderNode.svelte';
	import Folder from '@lucide/svelte/icons/folder';
	import File from '@lucide/svelte/icons/file';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Inbox from '@lucide/svelte/icons/inbox';
	import Mail from '@lucide/svelte/icons/mail';
	import MailPlus from '@lucide/svelte/icons/mail-plus';
	import MailOpen from '@lucide/svelte/icons/mail-open';
	import MailX from '@lucide/svelte/icons/mail-x';
	import MailWarning from '@lucide/svelte/icons/mail-warning';
	import { goto } from '$app/navigation';
	import { openFolders, toggleFolder } from '../../stores/folderStore';


	const {
		name = '',
		subtree = {},
		level = 0,
		fullPath = name,
		inflate = () => {
		}
	} = $props();

	let selectedFolder = $state();
	let hasChildren = Object.keys(subtree).length > 0;

	let isOpen = $state(false);


	$effect(() => {
		const newIsOpen = $openFolders.has(fullPath);

		if (isOpen !== newIsOpen) {
			isOpen = newIsOpen;
		}
	});

	function handleClick() {
		if (hasChildren) {

			toggleFolder(fullPath);
		}

		const currentPath = window.location.pathname;
		const targetPath = `/u/0/${fullPath}`;

		if (currentPath !== targetPath) {
			inflate(fullPath);
			goto(targetPath);
		}
	}
</script>

<button class="chat-item" style="padding-left: {level * 1.25}rem;" onclick={handleClick}>
  <span class="icon">
    {#if hasChildren}
      {#if isOpen}
				<ChevronDown size="16" />
			{:else}
				<ChevronRight size="16" />
			{/if}


    {/if}
  </span>

	<span class="folder-icon">
    {#if name.toLowerCase() === 'inbox'}
      <Inbox size="16" />
    {:else if name.toLowerCase() === 'draft'}
      <MailPlus size="16" />
    {:else if name.toLowerCase() === 'sent'}
      <MailOpen size="16" />
    {:else if name.toLowerCase() === 'trash'}
      <MailX size="16" />
    {:else if name.toLowerCase() === 'spam'}
      <MailWarning size="16" />
    {:else if hasChildren}
      <Folder size="16" />
    {:else}
      <Mail size="16" />
    {/if}
  </span>

	<span>{name}</span>
</button>


{#if isOpen && hasChildren}
	<div class="nested">
		{#each Object.entries(subtree) as [childName, childSubtree]}
			<FolderNode name={childName}
									subtree={childSubtree}
									level={level + 1}
									fullPath={`${fullPath}/${childName}`}
			/>
		{/each}
	</div>
{/if}

<style>
    .chat-item {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.5rem;
        cursor: pointer;
        border-radius: 6px;
        background-color: transparent;
        transition: background 0.2s;
        user-select: none;
    }

    .chat-item:hover {
        background-color: var(--primary-foreground);
    }

    .nested {
        border-left: 1px solid #555;
        margin-left: 1.5rem;
        padding-left: 0.5rem;
    }

    .icon, .folder-icon {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
