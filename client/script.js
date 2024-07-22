let userName;

document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  const onboarding = document.getElementById('onboarding');
  const chatroom = document.getElementById('chatroom');
  const joinChat = document.getElementById('joinChat');
  const userNameInput = document.getElementById('userNameInput');
  const messageInput = document.getElementById('messageInput');
  const sendMessage = document.getElementById('sendMessage');
  const chatMessages = document.getElementById('chatMessages');
  const activeUsers = document.getElementById('activeUsers');
  const typingIndicator = document.getElementById('typingIndicator');
  const joinMessage = document.getElementById('joinMessage');
  const userJoinedToast = document.getElementById('userJoinedToast');
  const activeUsersCount = document.getElementById('activeUsersCount');

  // Handle join chat operation
  joinChat.addEventListener('click', () => {
    userName = userNameInput.value.trim();

    if (userName) {
      onboarding.classList.add('d-none');
      chatroom.classList.remove('d-none');
      socket.emit('join', userName);
    }
  });

  // Handle send message operation
  sendMessage.addEventListener('click', () => {
    const message = messageInput.value.trim();

    if (message) {
      socket.emit('sendMessage', { userName, message, timestamp: new Date() });
      messageInput.value = '';
    }
  });

  // Inform server when user is typing
  messageInput.addEventListener('input', () => {
    socket.emit('typing', userName);
  });

  // Show welcome user
  socket.on('welcome', (userName) => {
    joinMessage.innerText = `Welcome ${userName}...🎉`;
    const toast = new bootstrap.Toast(userJoinedToast);
    toast.show();
  });

  // Update active users list
  socket.on('activeUsers', (users) => {
    activeUsersCount.innerText = users.length;
    activeUsers.innerHTML = '';

    users.forEach((user) => {
      const userElement = document.createElement('li');
      userElement.className = 'list-group-item';
      userElement.textContent = user;
      activeUsers.appendChild(userElement);
    });
  });

  // Notify user with joined user
  socket.on('userJoined', (userName) => {
    joinMessage.innerText = `${userName} has joined the chat!`;
    const toast = new bootstrap.Toast(userJoinedToast);
    toast.show();
  });

  // Display previous messages
  socket.on('previousMessages', (previousMessages) => {
    previousMessages.forEach((m) => {
      displayMessage(m.userName, m.message, m.timestamp);
    });
  });

  // Display incoming messages
  socket.on('broadcast_message', ({ userName, message, timestamp }) => {
    displayMessage(userName, message, timestamp);
  });

  // Display typing indicator
  socket.on('notifyTyping', (user) => {
    typingIndicator.textContent = `${user} is typing...`;
    setTimeout(() => {
      typingIndicator.textContent = '';
    }, 1000);
  });

  // Helper function to display message
  const displayMessage = (userName, message, timestamp) => {
    timestamp = formatTimestamp(timestamp);

    const messageElement = document.createElement('div');
    messageElement.className = 'message';

    messageElement.innerHTML = `
      <img src="https://avatar.iran.liara.run/username?username=${userName}" alt="Profile Picture">
      <div>
        <div class="message-content"><strong>${userName}</strong>: ${message}</div>
        <div class="message-time">${timestamp}</div>
      </div>
    `;

    chatMessages.appendChild(messageElement);
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    const todayDate = new Date().getDate();

    timestamp = new Date(timestamp);

    return (timestamp =
      timestamp.getDate() < todayDate
        ? timestamp.toLocaleString()
        : timestamp.toLocaleTimeString());
  };
});
