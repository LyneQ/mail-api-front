<script lang="ts">
	import FolderNode from './FolderNode.svelte';
	import Folder from '@lucide/svelte/icons/folder';
	import File from '@lucide/svelte/icons/file';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';


	export let name: string;
	export let subtree: Record<string, any>;
	export let level: number;
	export let fullPath: string = name;


	let open = false;
	let hasChildren = Object.keys(subtree).length > 0;

	function handleClick() {
		console.info(fullPath);
		if (hasChildren) open = !open;
	}
</script>

<button class="chat-item" style="padding-left: {level * 1.25}rem;" on:click={handleClick}>
  <span class="icon">
    {#if hasChildren}
      {#if open}
				<ChevronDown size="16" />
			{:else}
				<ChevronRight size="16" />
			{/if}
    {:else}
      <File size="16" />
    {/if}
  </span>

	<span class="folder-icon">
    {#if hasChildren}
      <Folder size="16" />
    {/if}
  </span>

	<span>{name}</span>
</button>


	{#if open && hasChildren}
		<div class="nested">
			{#each Object.entries(subtree) as [childName, childSubtree]}
				<FolderNode name={childName}
										subtree={childSubtree}
										level={level + 1}
										fullPath={`${fullPath}/${childName}`} />
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
