<script> 
   import { onMount, onDestroy } from 'svelte';
   
   export let conversation; 
   export let setConversation; 
   
   let timeSince = '';
   let interval;
   
   function updateTimeSince() { 
      if (conversation["ts"] != null) {
         const now = new Date()
         const timeDiff = Math.floor((now.getTime() / 1000) - conversation["ts"])
         
         if (timeDiff < 60 * 2) {
            timeSince = `just now`
         } else if (timeDiff < 3600 * 2) {
            timeSince = `${Math.floor(timeDiff / 60)} minutes ago`
         } else if (timeDiff < 86400 * 2) {
            timeSince = `${Math.floor(timeDiff / 3600)} hours ago`
         } else {
            timeSince = `${Math.floor(timeDiff / 86400)} days ago`
         }
      } else {
         timeSince = ''
      }
   }
   
   onMount(() => {
      updateTimeSince()
      interval = setInterval(updateTimeSince, 60000) // Update every minute
   })
   
   onDestroy(() => {
      if (interval) clearInterval(interval)
   })
</script>

<style> 
   .button {
      background-color: var(--alt-theme-color);
      border: none; 
      color: var(--text-color);
      padding: 10px; 
      text-align: left; 
      text-decoration: none; 
      display: flex; 
      flex-direction: column;
      width: 100%;
      cursor: pointer; 
      border-radius: 8px; 
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 10px;
      transition: background-color 0.3s ease;
      
   }
   .button:hover {
      background-color: var(--alt-theme-color-light);
   }
   .conversation-message {
      align-self: flex-start;
   }
   .conversation-subtext { 
      margin: 0.5rem 0; 
      color: var(--alt-text-color);
   } 
</style>
<button class="button" on:click={() => setConversation(conversation["conversation_id"])}> 
   <p class='conversation-message'>{conversation["title"]}</p> 
   <p class='conversation-subtext'>{timeSince}</p> 
</button>