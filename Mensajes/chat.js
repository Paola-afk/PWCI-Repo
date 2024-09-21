
    const chatButton = document.getElementById('chatButton');
    const chatWindow = document.getElementById('chatWindow');

    chatButton.addEventListener('click', () => {
        if (chatWindow.classList.contains('chat-open')) {
            chatWindow.classList.remove('chat-open');
            chatWindow.classList.add('chat-close');
            setTimeout(() => {
                chatWindow.classList.remove('chat-close');
                chatWindow.style.display = 'none';
            }, 300); // Espera que termine la animación
        } else {
            chatWindow.style.display = 'block';
            chatWindow.classList.add('chat-open');
        }
    });