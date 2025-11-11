<script> 
    import { onMount, tick } from 'svelte';
    import Message from '$lib/components/Message.svelte'; 
    import Conversation from '$lib/components/Conversation.svelte';
    import ConversationButton from '$lib/components/ConversationButton.svelte';
    import ImageIcon from "$lib/assets/image_icon.png"
    let prompt_input = ''; 
    let messages = [];
    let conversation_list = []
    let scroll;
    let conversation_id = null;
    let uploaded_images = [];
    let fileinput;

    const onFileSelected =(e)=>{
        uploaded_images = []
        let images = Array.from(e.target.files);
        images.forEach(image => {
            let reader = new FileReader();
            reader.onload = e => {
                uploaded_images = [...uploaded_images, e.target.result];
            };
            reader.readAsDataURL(image);
        })
    }

    onMount(async () => {
        getConversationsList()
        scrollToBottom()
    });

    function scrollToBottom() {
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
            conversation_list = myJson
        }
        catch (error) {
            console.log("Server error: " + error)
            return "Server error: " + error
        }
    }

    const getLLMresponse = async () => {
        try {
            let llm_prompt = prompt_input
            let llm_images = uploaded_images
            prompt_input = '';
            uploaded_images = []
            let llm_images_base64 = llm_images.map(img => img.split(',')[1])
            const response = await fetch('http://127.0.0.1:8000/llm/conversation', {
                method: 'POST',
                body: JSON.stringify({conversation_id: conversation_id, prompt_text: llm_prompt, images: llm_images_base64}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const myJson = await response.json();
            console.log(myJson)
            return myJson
        }
        catch (error) {
            console.log("Server error: " + error)
            return "Server error: " + error
        }
    }

    async function sendPrompt(event) { 
        if (prompt_input != '') {
            let now = new Date().getTime() / 1000
            let message_images = uploaded_images.map(uploaded_image => ({ "image": uploaded_image.split(',')[1] }));
            messages = [...messages, {entity: "user", message: prompt_input, images: message_images, ts: now}];
            await tick();
            scrollToBottom()


            let response = await getLLMresponse();
            if (conversation_id == null) {
                getConversationsList()
            }
            conversation_id = response["conversation_id"];
            messages = response["conversation"];
            
            if (fileinput) {
                fileinput.value = '';
            }
            await tick();
            scrollToBottom()
        }
    } 
    async function setConversation(new_conversation_id) {
        try {
            messages = []
            uploaded_images = []
            if (fileinput) {
                fileinput.value = '';
            }
            if (new_conversation_id != null) {
                const response = await fetch('http://127.0.0.1:8000/llm/conversation?conversation_id=' + new_conversation_id, {
                    method: 'GET'
                });
                const myJson = await response.json();
                console.log(myJson)
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
    .page {
        max-width: 100%;
        padding: 40px;
        display: flex;
        flex-direction: column;
        height: 85vh;
    }
    .main-panel {
        width: 90%;
        height: 100%;
        display: flex;
        justify-content: flex-end;
        flex-direction: row;
    }
    .side-panel {
        width: 30%;
        max-width: 300px;
        margin: 20px;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .conversation-list {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        max-height: 100vh;
    }
    .conversation-list::-webkit-scrollbar {
        height: 12px;
    }
    .conversation-list::-webkit-scrollbar-track {
        background: var(--theme-color-dark);
        border-radius: 8px;
    }
    .conversation-list::-webkit-scrollbar-thumb {
        background: var(--theme-color);
        border-radius: 8px;
    }

    .conversation-list::-webkit-scrollbar-thumb:hover {
        background: var(--theme-color-light);
    }
    .conversation-panel {
        width: 70%;
        height: 100%;
        align-self: center;
        display: flex;
        flex-direction: column;
    }
    .conversation-container {
        flex: 1;
        align-content: flex-end;
        overflow-y: auto;
        padding: 1rem;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        margin-bottom: 1rem;
        background: var(--secondary-background-color);
        min-height: 50vh;
        max-height: 100vh;
    }
    .conversation-container::-webkit-scrollbar {
        height: 12px;
    }
    .conversation-container::-webkit-scrollbar-track {
        background: var(--theme-color-dark);
        border-radius: 8px;
    }
    .conversation-container::-webkit-scrollbar-thumb {
        background: var(--theme-color); 
        border-radius: 8px;
    }

    .conversation-container::-webkit-scrollbar-thumb:hover {
        background: var(--theme-color-light);
    }
    .prompt-input-panel {
        display:flex;
        align-self: flex-end;
        justify-content: flex-end;
        width: 100%;
    }
    .prompt-input {
        background: var(--secondary-background-color);
        color: var(--border-color);
        border: 1px solid var(--border-color);
        text-indent: 5px;
        margin-right: 3px;
        width: 70%;
        border-radius: 4px;
    }
    .message-button{
        background-color: var(--theme-color);
        color: var(--text-color);
        border: none;
        margin-inline: 2px;
		display:flex;
	    height:30px;
		cursor:pointer;
        padding: 5px;
        border-radius: 3px;
        align-items: center;
	}
    .message-button:hover{
        background-color: var(--theme-color-light);
    }
	.uploaded-image{
		display:flex;
		width:200px;
	}
    .images-list{
		display:flex;
        margin: 10px;
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
    .primary-button{
        background-color: var(--theme-color);
        color: var(--text-color);
        border: none;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
        margin-inline: 10px;
    }
    .primary-button:hover{
        background-color: var(--theme-color-light);
    }
</style>

<div class='page'> 
    <div class='main-panel'>
        <div class='side-panel' bind:this={scroll}>
            <div class='conversation-list' bind:this={scroll}>
                {#each conversation_list as conversation}
                    <ConversationButton conversation={conversation} setConversation={setConversation}/>
                {/each}
            </div>
            <button class='primary-button' on:click={() => setConversation(null)}> 
                <p class='conversation-message'>{"New Conversation"}</p> 
            </button>
        </div>
        <div class='conversation-panel'>
            <div class='conversation-container' bind:this={scroll}>
                <Conversation {messages} />
            </div>
            <div class='prompt-input-panel' > 
                <input class='prompt-input' type="text" id="Prompt Input" bind:value={prompt_input} on:keydown={handleKeydown}/>
                <div>
                    
                    <button class="message-button" on:click={() => fileinput.click()}>
                        <img src={ImageIcon} alt="Upload attachment"/>
                    </button>
                    <input style="display:none" type="file" multiple accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >
                </div>
                <button class="message-button" on:click={sendPrompt}>Send</button>
            </div> 
            <div class='images-list' > 
                {#if uploaded_images != []}
                    {#each uploaded_images as uploaded_image}
                        <img class="uploaded-image" src="{uploaded_image}" alt="Attachment" />
                    {/each}
                {/if}
            </div>
        </div>
    </div>
</div>

