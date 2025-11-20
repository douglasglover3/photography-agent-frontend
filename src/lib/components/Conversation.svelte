<script>
    import Message from '$lib/components/Message.svelte'; 
    import { onMount } from 'svelte';
    export let messages = [];
    export let isWaitingForLLM = false;
</script>

<style> 
    .conversation {
        padding: 20px;
        display: flex;
        flex-direction: column;
    }

    .loading-message {
        background-color: var(--theme-color);
        border-radius: 8px; 
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 1rem; 
        margin-bottom: 1rem; 
        width: 60%;
        align-self: flex-start;
        display: flex;
        align-items: center;
        gap: 10px;
    }
        
    .loading-dots {
        display: flex;
        gap: 5px;
        align-items: center;
    }
    
    .loading-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: var(--text-color);
        animation: bounce 1.4s infinite ease-in-out both;
    }
    
    .loading-dot:nth-child(1) {
        animation-delay: -0.32s;
    }
    
    .loading-dot:nth-child(2) {
        animation-delay: -0.16s;
    }
    
    @keyframes bounce {
        0%, 80%, 100% { 
            transform: scale(0);
            opacity: 0.5;
        } 
        40% { 
            transform: scale(1);
            opacity: 1;
        }
    }
</style>

<div class='conversation'>
    {#if messages != null && messages.length == 0 && !isWaitingForLLM}
        <h4 style="display: flex; align-self: center; color: var(--theme-color-dark); ">New conversation started. Say hi!</h4>
    {/if}
    {#each messages as message}
        {#if message.hidden != 1}
            <Message message_sender={message.entity} message_text={message.message} message_images={message.images} message_timestamp={message.ts}/>
        {/if}
    {/each}
    {#if isWaitingForLLM}
        <div class="loading-message">
            <div class="loading-dots">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
        </div>
    {/if}
</div>