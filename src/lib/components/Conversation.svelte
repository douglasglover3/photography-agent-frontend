<script>
    import Message from '$lib/components/Message.svelte'; 
    import { onMount } from 'svelte';
    export let messages = [];
</script>
<style> 
    .conversation {
        padding: 20px;
        display: flex;
        flex-direction: column;
    }
</style>
<div class='conversation'>
    {#if messages != null && messages.length == 0}
        <h4 style="display: flex; align-self: center; color: var(--theme-color-dark); ">New conversation started. Say hi!</h4>
    {/if}
    {#each messages as message}
        {#if message.hidden != 1}
            <Message message_sender={message.entity} message_text={message.message} message_images={message.images} message_timestamp={message.ts}/>
        {/if}
    {/each}
</div>