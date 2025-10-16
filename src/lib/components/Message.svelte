<script> 
   import { onMount, onDestroy } from 'svelte';
   
   export let message_sender; 
   export let message_text; 
   export let message_images; 
   export let message_timestamp;
   
   let timeSince = '';
   let interval;
   
   function updateTimeSince() { 
      if (message_timestamp != null) {
         const now = new Date()
         const timeDiff = Math.floor((now.getTime() / 1000) - message_timestamp)
         
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
   .left-message {
      background-color: var(--theme-color);
      border-radius: 8px; 
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1rem; 
      margin-bottom: 1rem; 
      transition: box-shadow 0.3s ease; 
      width: 60%;
      align-self: flex-start;
   }
   .right-message {
      background-color: var(--alt-theme-color);
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
      color: var(--text-color);
   } 
   .message-subtext { 
      margin: 0.5rem 0; 
      color: var(--alt-text-color);
   } 
   .message-image{
		display:flex;
		width:100px;
	}
   .images-list{
		display:flex;
      max-width: 100%;
      overflow-x: auto;
	}
   .images-list::-webkit-scrollbar {
      height: 12px;
   }
   .images-list::-webkit-scrollbar-track {
      background: var(--theme-color-dark);
      border-radius: 8px;
   }
   .images-list::-webkit-scrollbar-thumb {
      background: var(--theme-color);
      border-radius: 8px;
   }

   .images-list::-webkit-scrollbar-thumb:hover {
      background: var(--theme-color-light);
   }
</style>
{#if message_sender == "User"}
   <div class="right-message"> 
      <p class='message-content'>{message_text}</p> 
      <div class='images-list' > 
            {#if message_images != []}
               {#each message_images as message_image}
                  <img class="message-image" src="{"data:image/jpg;base64," + message_image.image}" alt="Attachment" />
               {/each}
            {/if}
      </div>
      <p class='message-subtext'>{timeSince}</p> 
   </div>
{:else}
   <div class="left-message"> 
      <p class='message-content'>{message_text}</p> 
      <div class='images-list' > 
            {#if message_images != []}
               {#each message_images as message_image}
                  <img class="message-image" src="{"data:image/jpg;base64," + message_image.image}" alt="Attachment" />
               {/each}
            {/if}
      </div>
      <p class='message-subtext'>{timeSince}</p> 
   </div>
{/if}