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
      console.log(conversation)
      updateTimeSince()
      interval = setInterval(updateTimeSince, 60000) // Update every minute
   })
   
   onDestroy(() => {
      if (interval) clearInterval(interval)
   })
</script>

<style> 
   .conversation-message {
      align-self: flex-start;
   }
   .conversation-subtext { 
      margin: 0.5rem 0; 
      color: #666; 
   } 
</style>
<button on:click={() => setConversation(conversation["conversation_id"])}> 
   <p class='conversation-message'>{conversation["title"]}</p> 
   <p class='conversation-subtext'>{timeSince}</p> 
</button>