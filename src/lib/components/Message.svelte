<script> 
   import { onMount, onDestroy } from 'svelte';
   
   export let message_sender; 
   export let message_text; 
   export let message_timestamp;
   
   let timeSince = '';
   let interval;
   
   function updateTimeSince() { 
      if (message_timestamp != null) {
         const now = new Date()
         const timeDiff = Math.floor((now.getTime() - message_timestamp.getTime()) / 1000)
         
         if (timeDiff < 60) {
            timeSince = `just now`
         } else if (timeDiff < 3600) {
            timeSince = `${Math.floor(timeDiff / 60)} minutes ago`
         } else if (timeDiff < 86400) {
            timeSince = `${Math.floor(timeDiff / 3600)} hours ago`
         } else {
            timeSince = message_timestamp.toLocaleDateString()
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
   .left-message {
      background-color: #8a9fff; 
      border-radius: 8px; 
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1rem; 
      margin-bottom: 1rem; 
      transition: box-shadow 0.3s ease; 
      width: 60%;
      align-self: flex-start;
   }
   .right-message {
      background-color: #8ae8ff; 
      border-radius: 8px; 
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1rem; 
      margin-bottom: 1rem; 
      transition: box-shadow 0.3s ease; 
      width: 60%;
      align-self: flex-end;
   }
   .message-content { 
      margin: 0.5rem 0; 
      color: #000000; 
   } 
   .message-subtext { 
      margin: 0.5rem 0; 
      color: #666; 
   } 
</style>
{#if message_sender == "User"}
   <div class="right-message"> 
      <p class='message-content'>{message_text}</p> 
      <p class='message-subtext'>{timeSince}</p> 
   </div>
{:else}
   <div class="left-message"> 
      <p class='message-content'>{message_text}</p> 
      <p class='message-subtext'>{timeSince}</p> 
   </div>
{/if}