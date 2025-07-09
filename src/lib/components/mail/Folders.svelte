<script lang="ts">
	export let folders: string[] = [];

	function createFolderTree(paths: string[]): Record<string, any> {
		paths.sort();
		const root: Record<string, any> = {};

		for (const path of paths) {
			const segments = path.split('/');
			let current = root;
			for (const segment of segments) {
				if (!current[segment]) {
					current[segment] = {};
				}
				current = current[segment];
			}
		}

		return root;
	}

	const folderTree = createFolderTree(folders);

	function renderFolderTree(
		tree: Record<string, any>,
		basePath = '',
		level = 0
	): string {
		let html = `<ul style="padding-left: ${level * 1.5}rem;">`;

		for (const folderName in tree) {
			const path = basePath ? `${basePath}/${folderName}` : folderName;

			html += `
				<li data-path="${path}" style="margin: 0.2rem 0;">
					<span style="display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer;">
						<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
							viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
						</svg>
						${folderName}
					</span>
			`;

			if (Object.keys(tree[folderName]).length > 0) {
				html += renderFolderTree(tree[folderName], path, level + 1);
			}

			html += `</li>`;
		}

		html += `</ul>`;
		return html;
	}

	function handleClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		const folderItem = target.closest('li[data-path]');
		const path = folderItem?.dataset.path;
		if (path) {
			console.log('Clicked folder:', path);
		}
	}
</script>

<div class="folder-list" on:click={handleClick}>
	{@html renderFolderTree(folderTree)}
</div>

<style lang="scss">
  .folder-list {
    display: flex;
    flex-direction: column;
    width: 200px;
		height: 93vh;
    padding: 1rem;
    overflow: hidden;

    border-right: 1px solid var(--color-sidebar-border);
  }
</style>