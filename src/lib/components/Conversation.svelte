<script>
    import Message from '$lib/components/Message.svelte'; 
    export let messages = [];

</script>
<style> 
    .conversation {
        background-color: #f0f0f000; 
        padding: 20px;
        display: flex;
        flex-direction: column;
    }
</style>
<div class='conversation'>
    {#each messages as message}
        {#if message.hidden != 1}
            <Message message_sender={message.entity} message_text={message.message} message_timestamp={message.ts}/>
        {/if}
    {/each}
</div>