import { writable, get } from 'svelte/store';

// Store to keep track of which folders are open
export const openFolders = writable<Set<string>>(new Set());

// Helper functions to manipulate the store
export function toggleFolder(folderPath: string) {
  openFolders.update(folders => {
    const newFolders = new Set(folders);
    if (newFolders.has(folderPath)) {
      newFolders.delete(folderPath);
    } else {
      newFolders.add(folderPath);
    }
    return newFolders;
  });
}

export function isOpen(folderPath: string): boolean {
  const folders = get(openFolders);
  return folders.has(folderPath);
}
