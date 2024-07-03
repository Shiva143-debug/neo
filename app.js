
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form-container');
  const loginForm = document.getElementById('login-form-container');
  const chatContainer = document.getElementById('chat-container');
  const loginRegisterContainer = document.getElementById('login-register');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const messagesContainer = document.getElementById('messages');
  const registerBtn = document.getElementById('register-btn');
  const loginBtn = document.getElementById('login-btn');
  const userBoxesContainer = document.getElementById('user-boxes');
  const userSearchInput = document.getElementById('user-search');
  const usernameInput = document.getElementById('register-username');
  const emailInput = document.getElementById('register-email');
  const passwordInput = document.getElementById('register-password');
  const inputContainer=document.getElementById('input-container')
  const backButton=document.getElementById('back-button')
  const eNameElement=document.getElementById('e-name')

  let ws = null;
  let token;
  let currentUserEmail;
  let userCardClicked = false;

  // Initialize WebSocket connection
  initializeWebSocket();

  loginBtn.style.backgroundColor = 'white';
  loginBtn.style.color = 'black';
  loginBtn.style.border = '1px solid black'



  registerBtn.addEventListener('click', function () {
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
    chatContainer.style.display = 'none';

    registerBtn.style.backgroundColor = '#2196F3';
    registerBtn.style.color = 'white';
    loginBtn.style.backgroundColor = 'white';
    loginBtn.style.color = 'black';
    loginBtn.style.border = '1px solid black'

    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
    username.value = "";
    email.value = "";
    password.value = ""


  });

  loginBtn.addEventListener('click', function () {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    chatContainer.style.display = 'none';
    loginBtn.style.backgroundColor = '#2196F3';
    loginBtn.style.color = 'white';
    registerBtn.style.backgroundColor = 'white';
    registerBtn.style.color = 'black';
    registerBtn.style.border = '1px solid black'

    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
  });

  // Event listener for registration form submission
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
      const response = await fetch('https://sleet-foregoing-timer.glitch.me/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        token = data.token;
        usernameInput.value = '';
        emailInput.value = '';
        passwordInput.value = '';
      } else {
        alert(data.msg);
        usernameInput.value = '';
        emailInput.value = '';
        passwordInput.value = '';
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Failed to register. Please try again later.');
    }
  });

  // Event listener for login form submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const response = await fetch('https://sleet-foregoing-timer.glitch.me/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Login successful!');
        token = data.token;
        setCurrentUser(email);
        switchToChatView();
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Failed to login. Please try again later.');
    }
  });

  // Event listener for sending messages
  // sendButton.addEventListener('click', async () => {
  //   const message = messageInput.value;
  //   if (message && ws && ws.readyState === WebSocket.OPEN && selectedUserEmail) {
  //     const payload = {
  //       token,
  //       text: message,
  //       senderEmail: currentUserEmail,
  //       recipientEmail: selectedUserEmail
  //     };

  //     try {
  //       ws.send(JSON.stringify(payload));
  //       console.log('Message sent via WebSocket');
  //       messageInput.value = '';
  //       // fetchAndDisplayMessages(selectedUserEmail, currentUserEmail)
  //     } catch (error) {
  //       console.error('Error sending message via WebSocket:', error);
  //       alert('Failed to send message via WebSocket. Please try again later.');
  //     }
  //   } else {
  //     console.error('WebSocket connection is not open, message is empty, or recipient is not selected');
  //   }
  // });
  sendButton.addEventListener('click',  async (e) =>  {
    e.preventDefault();
    const message = messageInput.value;
    

    if (!message) {
      console.error('Message is empty');
      return;
    }

    if (!selectedUserEmail) {
      console.error('Recipient is not selected');
      return;
    }

    if (!ws) {
      console.error('WebSocket object is not defined');
      return;
    }

    if (ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket connection is not open');
      return;
    }

    const payload = {
      token,
      text: message,
      senderEmail: currentUserEmail,
      recipientEmail: selectedUserEmail
    };

    try {
      ws.send(JSON.stringify(payload));
      console.log('Message sent via WebSocket');
      messageInput.value = '';
      fetchAndDisplayMessages(selectedUserEmail, currentUserEmail)
      // inputContainer.style.display = 'block';
      // userBoxesContainer.style.display='none' 
      

    } catch (error) {
      console.error('Error sending message via WebSocket:', error);
      alert('Failed to send message via WebSocket. Please try again later.');
    }
  });

  // Function to initialize WebSocket connection
  function initializeWebSocket() {
    const wsUrl = `wss://sleet-foregoing-timer.glitch.me/websocket`;
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const { username, message, timestamp, sender_email, recipient_email } = JSON.parse(event.data);
      displayMessage(username, message, timestamp, sender_email, recipient_email);
      fetchAndDisplayMessages(selectedUserEmail, currentUserEmail)
    };



    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  // Function to switch to chat view after login or registration
  function switchToChatView() {
    loginRegisterContainer.style.display = 'none';
    chatContainer.style.display = 'flex';
    fetchUsers(); // Fetch and display users after login
  }


  // Function to fetch and display users
  async function fetchUsers() {
    try {
      const response = await fetch('https://sleet-foregoing-timer.glitch.me/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      userBoxesContainer.innerHTML = ''; // Clear previous users
      data.forEach(user => displayUsers(user.username, user.email));
    } catch (error) {
      console.error('Error fetching users:', error);
      displayErrorMessage('Failed to fetch users. Please try again later.');
    }
  }


  async function fetchAndDisplayMessages(recipientEmail, senderEmail) {
    try {
      // Fetch messages based on recipientEmail and senderEmail
      const url = `https://sleet-foregoing-timer.glitch.me/messages?recipientEmail=${recipientEmail}&senderEmail=${senderEmail}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
      }

      const allMessages = await response.json();

      // Sort combined messages by timestamp
      allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      messagesContainer.innerHTML = ''; // Clear the container before appending new messages
      allMessages.forEach(message => displayMessage(message.username, message.message, message.timestamp, message.sender_email));
      // initializeWebSocket()
    } catch (error) {
      console.error('Error fetching messages:', error);
      displayErrorMessage(error.message);
    }
  }

  // Function to display a message in the chat window
  function displayMessage(username, message, timestamp, senderEmail) {
    userSearchInput.style.display='none'
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    const isCurrentUser = senderEmail === getCurrentUser();
    // const otherUser = recipientEmail !== getCurrentUser();

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');

    const messageText = document.createElement('div');
    messageText.classList.add('message-text');
    messageText.textContent = message;
    messageContent.appendChild(messageText);

    const messageTime = document.createElement('div');
    messageTime.classList.add('message-time');
    const dateObj = new Date(timestamp);
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    messageTime.textContent = `${hours}:${minutes}`;
    messageContent.appendChild(messageTime);


    messageElement.appendChild(messageContent);
    if (isCurrentUser) {
      messageElement.classList.add('current-user');
      messageElement.appendChild(messageContent);

      // const avatarCircle = document.createElement('div');
      // avatarCircle.classList.add('avatar-circle');
      // avatarCircle.textContent = username.slice(0, 2).toUpperCase();
      // messageElement.appendChild(avatarCircle);
    } else {
      messageElement.classList.add('other-user');

      // const avatarCircle = document.createElement('div');
      // avatarCircle.classList.add('avatar-circle');
      // avatarCircle.textContent = username.slice(0, 2).toUpperCase();
      // messageElement.appendChild(avatarCircle);

      messageElement.appendChild(messageContent);
    }

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // function displayUsers(username, email) {
  //   const userCard = document.createElement('div');
  //   userCard.classList.add('user-card');

  //   const usernameElement = document.createElement('div');
  //   usernameElement.textContent = `${username}`;
  //   userCard.appendChild(usernameElement);

  //   const emailElement = document.createElement('div');
  //   emailElement.textContent = `${email}`;
  //   userCard.appendChild(emailElement);

  //   userCard.addEventListener('click', () => {
  //     // Remove 'selected' class from all user cards
  //     userBoxesContainer.querySelectorAll('.user-card').forEach(card => card.classList.remove('selected'));
  //     // Add 'selected' class to the clicked user card
  //     userCard.classList.add('selected');
  //     // Update the selected user email
  //     selectedUserEmail = email;
  //     // Fetch and display messages for the selected user
  //     fetchAndDisplayMessages(selectedUserEmail, currentUserEmail);
  //   });

  //   userBoxesContainer.appendChild(userCard);
  // }
  //  if (window.innerWidth <= 768) {
  //     inputContainer.style.display = 'none';
  //     userBoxesContainer.style.display='block' 
  //     userBoxesContainer.style.width='100vw'
  //   }

  

if (window.innerWidth <= 768 && !userCardClicked) {
  inputContainer.style.display = 'none';
  userBoxesContainer.style.display = 'block';
  userBoxesContainer.style.width = '100vw';
}



  // function displayUsers(username, email) {
  //   const userCard = document.createElement('div');
  //   userCard.classList.add('user-card');



  //   function generateAvatar(username) {
  //     const avatarCircle = document.createElement('div');
  //     avatarCircle.classList.add('avatar-circle');
  //     avatarCircle.textContent = username.slice(0, 1).toUpperCase(); // Use the first letter of the username
  //     return avatarCircle;
  //   }
   
  //   const avatar = generateAvatar(username);
  //   userCard.appendChild(avatar);

  //   userCard.textContent = username;
  //   userCard.setAttribute('data-email', email); 

  //   userCard.addEventListener('click', () => {
  //     selectedUserEmail = email;

  //     // Check if screen width is less than or equal to 768px (assuming this is your mobile breakpoint)
  //     if (window.innerWidth <= 768 && userCardClicked) {
  //       inputContainer.style.display = 'block';
  //       userBoxesContainer.style.display='none';
  //       inputContainer.style.width='100vw' // Show input container only on mobile
  //       const avatar = generateAvatar(username);
        
  //       eNameElement.appendChild(avatar); // Append avatar first
  //       eNameElement.appendChild(document.createTextNode(username));;
  //     }
  //     userCardClicked = true;
  //     fetchAndDisplayMessages(selectedUserEmail, currentUserEmail);
  //   });

  //   userBoxesContainer.appendChild(userCard);
  // }
  function displayUsers(username, email) {
    // userBoxesContainer.appendChild(userSearchInput);
     userSearchInput.style.display='block'
    const userCard = document.createElement('div');
    userCard.classList.add('user-card');
  
    // Function to generate an avatar
    function generateAvatar(username) {
      const avatarCircle = document.createElement('div');
      avatarCircle.classList.add('avatar-circle');
      avatarCircle.textContent = username.slice(0, 1).toUpperCase(); // Use the first letter of the username
      return avatarCircle;
    }
  
    // Generate the avatar and append it to the user card
    const avatar = generateAvatar(username);
    userCard.appendChild(avatar);
  
    // Create a div for the username text and append it to the user card
    const usernameText = document.createElement('div');
    usernameText.classList.add('username-text');
    usernameText.textContent = username;
    usernameText.style.paddingLeft="10px";
    userCard.appendChild(usernameText);
  
    // Store email as data attribute
    userCard.setAttribute('data-email', email);
  
    // Add click event listener to the user card
    userCard.addEventListener('click', () => {
      selectedUserEmail = email;
  
      // Check if screen width is less than or equal to 768px (assuming this is your mobile breakpoint)
      if (window.innerWidth <= 768 && userCardClicked) {
        inputContainer.style.display = 'block';
        userBoxesContainer.style.display = 'none';
        inputContainer.style.width = '100vw'; // Show input container only on mobile
  
        // Clear previous content in eNameElement
        eNameElement.innerHTML = '';
  
        const avatarUsernameContainer = document.createElement('div');
        avatarUsernameContainer.classList.add('avatar-username-container');
    
        // Append avatar and username to the container
        const avatar = generateAvatar(username);
        avatarUsernameContainer.appendChild(avatar); // Append avatar first
        const usernameText = document.createElement('div');
        usernameText.classList.add('username-text');
        usernameText.textContent = username;
        usernameText.style.paddingLeft="10px";
        avatarUsernameContainer.appendChild(usernameText); // Append username text
    
        // Append the container to eNameElement
        eNameElement.appendChild(avatarUsernameContainer);
      }
  
      userCardClicked = true;
      fetchAndDisplayMessages(selectedUserEmail, currentUserEmail);
    });


  
    // Append the user card to the user boxes container
   
    userBoxesContainer.appendChild(userCard);
  }

  // userSearchInput.addEventListener('input', () => {
  //   const searchTerm = userSearchInput.value.toLowerCase();
  //   const userCards = userBoxesContainer.getElementsByClassName('user-card');
  
  //   Array.from(userCards).forEach(card => {
  //     const username = card.getAttribute('username-text');
  //     if (username.includes(searchTerm)) {
  //       card.style.display = 'flex'; // or 'block' based on your design
  //     } else {
  //       card.style.display = 'none';
  //     }
  //   });
  // });

  userSearchInput.addEventListener('input', () => {
    const searchTerm = userSearchInput.value.toLowerCase();
    const userCards = userBoxesContainer.getElementsByClassName('user-card');
  
    Array.from(userCards).forEach(card => {
      const username = card.getAttribute('data-username'); // Correct attribute name
      if (username.includes(searchTerm)) {
        card.style.display = 'flex'; // or 'block' based on your design
      } else {
        card.style.display = 'none';
      }
    });
  });


  backButton.addEventListener('click',function(){
userSearchInput.style.display='block'
    inputContainer.style.display = 'none';
    userBoxesContainer.style.display='block' 
    userBoxesContainer.style.width='100vw'
    eNameElement.textContent=""
    
  })
  function setCurrentUser(email) {
    currentUserEmail = email;
    localStorage.setItem('currentUserEmail', email);
  }

  // Function to get current user from local storage
  function getCurrentUser() {
    currentUserEmail = localStorage.getItem('currentUserEmail');
    return currentUserEmail;
  }

  // Function to display error messages
  function displayErrorMessage(errorMessage) {
    const errorElement = document.createElement('div');
    errorElement.classList.add('error');
    errorElement.textContent = `Error: ${errorMessage}`;
    messagesContainer.appendChild(errorElement);
  }
});

