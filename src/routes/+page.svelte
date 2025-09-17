<script> 
    import { onMount, tick } from 'svelte';
    import Message from '$lib/components/Message.svelte'; 
    import Conversation from '$lib/components/Conversation.svelte';
    let prompt_input = ''; 
    let messages = [];

    let scroll;

    onMount(() => {
        scrollToBottom()
    });

    function  scrollToBottom() {
        scroll.scroll({
            top: scroll.scrollHeight,
            behavior: 'smooth'
        });
    }

    const getLLMresponse = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/llm/prompt', {
                method: 'POST',
                body: JSON.stringify({prompt_text: prompt_input}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const myJson = await response.json();
            console.log(myJson)
            return myJson
        }
        catch (error) {
            return "Server error: " + error
        }
    }

    async function sendPrompt(event) { 
        if (prompt_input != '') {
            console.log(prompt_input);
            let now = new Date()
            messages = [...messages, {sender: "User", text: prompt_input, timestamp: now}];
            await tick();
            scrollToBottom()
            let response = await getLLMresponse(prompt_input);
            now = new Date()
            messages = [...messages, {sender: "LLM", text: response, timestamp: now}];
            prompt_input = '';
            await tick();
            scrollToBottom()
        }
    } 
    function handleKeydown(event) {
        if (event.key === 'Enter') {
            sendPrompt();
        }
    }
</script>

<style> 
    h1 { 
        color: purple; 
    } 
    .page {
        max-width: 100%;
        padding: 40px;
        display: flex;
        flex-direction: column;
        height: 100vh;
    }
    .conversation-panel {
        width: 50%;
        align-self: center;
        display: flex;
        flex-direction: column;
    }
    .conversation-container {
        flex: 1;
        align-content: flex-end;
        overflow-y: auto;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        margin-bottom: 1rem;
        background: #f9f9f9;
        min-height: 50vh;
        max-height: 50vh;
    }
    .prompt-input {
        align-self: flex-end;
    }
</style>

<div class='page'> 
    <h1>Photography Agent</h1>
    <div class='conversation-panel'>
        <div class='conversation-container' bind:this={scroll}>
            <Conversation {messages} />
        </div>
        <div class='prompt-input'> 
            <input type="text" id="Prompt Input" bind:value={prompt_input} on:keydown={handleKeydown}/>
            <button on:click={sendPrompt}>Send</button>
        </div> 
    </div>
</div>

