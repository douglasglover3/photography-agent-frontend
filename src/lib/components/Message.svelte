<script> 
   import { onMount, onDestroy } from 'svelte';
   
   export let message_sender; 
   export let message_text; 
   export let message_images; 
   export let message_timestamp;
   
   let timeSince = '';
   let interval;
   let expandedImage = null;
   
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
   
   function expandImage(image) {
      expandedImage = image;
      document.body.style.overflow = 'hidden';
   }
   
   function closeImage() {
      expandedImage = null;
      document.body.style.overflow = 'auto';
   }
   
   function handleKeydown(event) {
      if (event.key === 'Escape' && expandedImage) {
         closeImage();
      }
   }
   
   function handleModalClick(event) {
      if (event.target.classList.contains('modal-overlay')) {
         closeImage();
      }
   }
   
   onMount(() => {
      updateTimeSince()
      interval = setInterval(updateTimeSince, 60000)
      window.addEventListener('keydown', handleKeydown);
   })
   
   onDestroy(() => {
      if (interval) clearInterval(interval)
      window.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = 'auto';
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
   .message-image {
      display: flex;
      width: 100px;
      cursor: pointer;
      transition: opacity 0.2s ease;
      border-radius: 4px;
   }
   .message-image:hover {
      opacity: 0.8;
   }
   .images-list {
      display: flex;
      max-width: 100%;
      overflow-x: auto;
      gap: 8px;
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
   
   .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      cursor: pointer;
   }
   
   .modal-content {
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
   }
   
   .modal-image {
      max-width: 100%;
      max-height: 85vh;
      object-fit: contain;
      border-radius: 8px;
      cursor: default;
   }
   
   .close-button {
      background-color: var(--theme-color);
      color: var(--text-color);
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.2s ease;
   }
   
   .close-button:hover {
      background-color: var(--theme-color-light);
   }
</style>

{#if message_sender == "user"}
   <div class="right-message"> 
      <p class='message-content'>{message_text}</p> 
      <div class='images-list'> 
         {#if message_images != []}
            {#each message_images as message_image}
               <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
               <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
               <img 
                  class="message-image" 
                  src="data:image/jpg;base64,{message_image.image}" 
                  alt="Attachment (click to expand)"
                  on:click={() => expandImage(message_image.image)}
                  on:keydown={(e) => e.key === 'Enter' && expandImage(message_image.image)}
                  tabindex="0"
               />
            {/each}
         {/if}
      </div>
      <p class='message-subtext'>{timeSince}</p> 
   </div>
{:else}
   <div class="left-message"> 
      <p class='message-content'>{message_text}</p> 
      <div class='images-list'> 
         {#if message_images != []}
            {#each message_images as message_image}
               <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
               <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
               <img 
                  class="message-image" 
                  src="data:image/jpg;base64,{message_image.image}" 
                  alt="Attachment (click to expand)"
                  on:click={() => expandImage(message_image.image)}
                  on:keydown={(e) => e.key === 'Enter' && expandImage(message_image.image)}
                  tabindex="0"
               />
            {/each}
         {/if}
      </div>
      <p class='message-subtext'>{timeSince}</p> 
   </div>
{/if}

{#if expandedImage}
   <!-- svelte-ignore a11y_interactive_supports_focus -->
   <!-- svelte-ignore a11y_click_events_have_key_events -->
   <div class="modal-overlay" on:click={handleModalClick} role="dialog" aria-modal="true">
      <div class="modal-content">
         <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
         <img 
            class="modal-image" 
            src="data:image/jpg;base64,{expandedImage}" 
            alt="Expanded view"
            on:click={(e) => e.stopPropagation()}
         />
         <button class="close-button" on:click={closeImage}>Close</button>
      </div>
   </div>
{/if}