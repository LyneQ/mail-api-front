<script lang="ts">
	import FolderNode from './FolderNode.svelte';

	let {
		specialFolders = [],
		regularFolders = [],
	} = $props();


 function createFolderTree(paths: string[], preserveOrder: boolean = false): Record<string, any> {
 	const root: Record<string, any> = {};
 	if (!Array.isArray(paths) || paths.length === 0) {
 		console.log('No folders to process or folders is not an array');
 		return root;
 	}

 	if (!preserveOrder) {
 		paths.sort();
 	}

 	for (const path of paths) {
 		const segments = path.split('/');
 		let current = root;
 		for (const segment of segments) {
 			if (!current[segment]) current[segment] = {};
 			current = current[segment];
 		}
 	}
 	return root;
 }

 const specialFolderTree = createFolderTree(specialFolders, true);
 const regularFolderTree = createFolderTree(regularFolders);

</script>

<section class="folders">
	<!-- Special Folders -->
	<div class="special-folders">
		{#each Object.entries(specialFolderTree) as [name, subtree]}
			<FolderNode
				name={name}
				subtree={subtree}
				level={0}
				fullPath={name}
			/>
		{/each}
	</div>

	<!-- Separator -->
	{#if Object.keys(specialFolderTree).length > 0 && Object.keys(regularFolderTree).length > 0}
		<div class="folder-separator"></div>
	{/if}

	<!-- Regular Folders -->
	<div class="regular-folders">
		{#each Object.entries(regularFolderTree) as [name, subtree]}
			<FolderNode
				name={name}
				subtree={subtree}
				level={0}
				fullPath={name}
			/>
		{/each}
	</div>
</section>


<style lang="scss">
	.folders {
		margin-left: 2rem;
		margin-top: 3rem;
		border-right: 1px solid var(--border);
		width: 20vw;
    height: calc(100vh - 4.3rem);
    display: flex;
    flex-direction: column;
  }

  .special-folders, .regular-folders {
    display: flex;
    flex-direction: column;
  }

  .folder-separator {
    height: 1px;
    background-color: var(--border);
    margin: 0.5rem 1rem;
    opacity: 0.7;
  }
</style>
