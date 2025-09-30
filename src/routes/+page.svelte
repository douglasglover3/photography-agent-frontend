<script> 
    import { onMount, tick } from 'svelte';
    import Message from '$lib/components/Message.svelte'; 
    import Conversation from '$lib/components/Conversation.svelte';
    import ConversationButton from '$lib/components/ConversationButton.svelte';
    let prompt_input = ''; 
    let messages = [];
    let conversation_list = []
    let scroll;
    let conversation_id = null;

    onMount(async () => {
        getConversationsList()
        scrollToBottom()
    });

    function  scrollToBottom() {
        scroll.scroll({
            top: scroll.scrollHeight,
            behavior: 'smooth'
        });
    }

    const getConversationsList = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/llm/conversations', {
                method: 'GET'
            });
            const myJson = await response.json();
            console.log(myJson)
            conversation_list = myJson
        }
        catch (error) {
            return "Server error: " + error
        }
    }

    const getLLMresponse = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/llm/conversation', {
                method: 'POST',
                body: JSON.stringify({conversation_id: conversation_id, prompt_text: prompt_input}),
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
            let now = new Date().getTime() / 1000
            messages = [...messages, {entity: "User", message: prompt_input, ts: now}];
            await tick();
            scrollToBottom()
            let response = await getLLMresponse(prompt_input);
            if (conversation_id == null) {
                getConversationsList()
            }
            conversation_id = response["conversation_id"];
            messages = response["conversation"];
            prompt_input = '';
            await tick();
            scrollToBottom()
        }
    } 
    async function setConversation(new_conversation_id) {
        try {
            messages = []
            if (new_conversation_id != null) {
                const response = await fetch('http://127.0.0.1:8000/llm/conversation?conversation_id=' + new_conversation_id, {
                    method: 'GET'
                });
                const myJson = await response.json();
                messages = myJson;
                await tick();
                scrollToBottom();
            }
            conversation_id = new_conversation_id;
        }
        catch (error) {
            return "Server error: " + error
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
    .main-panel {
        width: 90%;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
    }
    .side-panel {
        width: 30%;
        display: flex;
        flex-direction: column;
    }
    .conversation-list {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        min-height: 50vh;
        max-height: 50vh;
    }
    .conversation-panel {
        width: 70%;
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
    <div class='main-panel'>
        <div class='side-panel' bind:this={scroll}>
            <div class='conversation-list' bind:this={scroll}>
                {#each conversation_list as conversation}
                    <ConversationButton conversation={conversation} setConversation={setConversation}/>
                {/each}
            </div>
            <button on:click={() => setConversation(null)}> 
                <p class='conversation-message'>{"New Conversation"}</p> 
            </button>
        </div>
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
</div>

