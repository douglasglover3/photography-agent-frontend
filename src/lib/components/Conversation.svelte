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
        <Message message_sender={message.sender} message_text={message.text} message_timestamp={message.timestamp}/>
    {/each}
</div>