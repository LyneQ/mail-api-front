<script lang="ts">
	import FolderNode from './FolderNode.svelte';
	export let folders: string[];

	function createFolderTree(paths: string[]): Record<string, any> {
		const root: Record<string, any> = {};
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

{#each Object.entries(folderTree) as [name, subtree]}
	<FolderNode
		name={name}
		subtree={subtree}
		level={0}
		fullPath={name}
	/>
{/each}
