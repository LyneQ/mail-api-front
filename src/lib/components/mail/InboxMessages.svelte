<script lang="ts">
  // Props to receive the messages data
  let { messages = [] } = $props();

  // Create a derived state for sorted messages
  let sortedMessages = $state([]);

  // Sort messages by date (most recent first)
  $effect(() => {
    if (messages.length > 0) {
      sortedMessages = [...messages].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      sortedMessages = [];
    }
  });

  // Format date to a more readable format
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<div class="inbox-container">
  <h2>Inbox Messages</h2>

  {#if sortedMessages.length === 0}
    <div class="empty-state">No messages found</div>
  {:else}
    <div class="message-list">
      {#each sortedMessages as message}
        <div class="message-item">
          <div class="message-header">
            <div class="message-from">{message.from}</div>
            <div class="message-date">{formatDate(message.date)}</div>
          </div>
          <div class="message-subject">{message.subject}</div>
          <div class="message-to">To: {message.to.join(', ')}</div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .inbox-container {
    width: 100%;
    height: calc(100vh - 4.3rem);
    overflow-y: auto;
    padding: 1rem;
  }

  h2 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    color: #888;
    font-style: italic;
  }

  .message-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .message-item {
    padding: 1rem;
    border-radius: 6px;
    background-color: var(--primary-foreground);
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--secondary);
    }
  }

  .message-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .message-from {
    font-weight: bold;
  }

  .message-date {
    color: #888;
    font-size: 0.9rem;
  }

  .message-subject {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  .message-to {
    font-size: 0.9rem;
    color: #666;
  }
</style>
