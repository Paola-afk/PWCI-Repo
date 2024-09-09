const chats = {
    chat1: [],
    chat2: [],
    chat3: []
};

let currentChat = 'chat1';

document.getElementById("send-btn").addEventListener("click", function() {
    let message = document.getElementById("chat-input").value;
    if (message.trim() !== "") {
        chats[currentChat].push(message);
        renderMessages();
        document.getElementById("chat-input").value = "";
    }
});

function renderMessages() {
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML = "";
    
    chats[currentChat].forEach(message => {
        let messageContainer = document.createElement("div");
        messageContainer.classList.add("flex", "justify-end");

        let messageBubble = document.createElement("div");
        messageBubble.classList.add("bg-[#9F88FF]", "text-white", "p-3", "rounded-tl-lg", "rounded-bl-lg", "rounded-br-lg", "max-w-[75%]", "mb-2");
        messageBubble.textContent = message;

        messageContainer.appendChild(messageBubble);
        chatMessages.appendChild(messageContainer);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function changeChat(chatId) {
    currentChat = chatId;
    document.getElementById("chat-title").textContent = "Chat con Tutor " + chatId.slice(-1);
    renderMessages();
}
