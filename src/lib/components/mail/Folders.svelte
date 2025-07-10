<script lang="ts">
	import FolderNode from './FolderNode.svelte';

	let {
		folders = [],
	} = $props();


	function createFolderTree(paths: string[]): Record<string, any> {
		const root: Record<string, any> = {};
		if (!Array.isArray(paths) || paths.length === 0) {
			console.log('No folders to process or folders is not an array');
			return root;
		}

		paths.sort();
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

	const folderTree = createFolderTree(folders);

</script>

<section class="folders">
	{#each Object.entries(folderTree) as [name, subtree]}
		<FolderNode
			name={name}
			subtree={subtree}
			level={0}
			fullPath={name}
		/>
	{/each}
</section>


<style lang="scss">
	.folders {
		margin-left: 2rem;
		border-right: 1px solid var(--border);
		width: 20vw;
    height: calc(100vh - 4.3rem);
  }
</style>
