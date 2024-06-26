
// document.addEventListener('DOMContentLoaded', () => {
//   const registerForm = document.getElementById('register-form-container');
//   const loginForm = document.getElementById('login-form-container');
//   const chatContainer = document.getElementById('chat-container');
//   const loginRegisterContainer = document.getElementById('login-register');
//   const messageInput = document.getElementById('message-input');
//   const sendButton = document.getElementById('send-button');
//   const messagesContainer = document.getElementById('messages');
//   const registerBtn = document.getElementById('register-btn');
//   const loginBtn = document.getElementById('login-btn');

//   let ws;
//   let token;
//   let currentUserEmail; 

//   loginBtn.style.backgroundColor = 'white';
//   loginBtn.style.color = 'black';
//   loginBtn.style.border='1px solid black'

//   registerBtn.addEventListener('click', function() {
//     registerForm.style.display = 'block';
//     loginForm.style.display = 'none';
//     chatContainer.style.display = 'none'; 

//     registerBtn.style.backgroundColor = '#2196F3'; 
//     registerBtn.style.color = 'white';
//     loginBtn.style.backgroundColor = 'white'; 
//     loginBtn.style.color = 'black';
//     loginBtn.style.border='1px solid black'
    
//     registerForm.style.display = 'none'; 
//     loginForm.style.display = 'block';

//   });

//   loginBtn.addEventListener('click', function() {
//     loginForm.style.display = 'block';
//     registerForm.style.display = 'none';
//     chatContainer.style.display = 'none'; 
//     loginBtn.style.backgroundColor = '#2196F3'; 
//     loginBtn.style.color = 'white';
//     registerBtn.style.backgroundColor = 'white'; 
//     registerBtn.style.color = 'black';
//     registerBtn.style.border='1px solid black'
    
//     loginForm.style.display = 'block'; 
//     registerForm.style.display = 'none'; 
//   });

//   registerForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const username = document.getElementById('register-username').value;
//     const email = document.getElementById('register-email').value;
//     const password = document.getElementById('register-password').value;

//     try {
//       const response = await fetch('https://sleet-foregoing-timer.glitch.me/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ username, email, password })
//       });

//       const data = await response.json();
//       if (response.ok) {
//         alert('Registration successful!');
//         token = data.token;
//         setCurrentUser(email); 
//         loginForm.style.display = 'block';
//         registerForm.style.display = 'none';
        
//         loginBtn.style.backgroundColor = 'blue'; 
//         loginBtn.style.color = 'white';
//         registerBtn.style.color = 'black';
//         registerBtn.style.backgroundColor = 'white';
//         registerBtn.style.border='1px solid black'

        
//       } else {
//         alert(data.msg);
//       }
//     } catch (error) {
//       console.error('Error during registration:', error);
//       alert('Failed to register. Please try again later.');
//     }
//   });

//   loginForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const email = document.getElementById('login-email').value;
//     const password = document.getElementById('login-password').value;

//     try {
//       const response = await fetch('https://sleet-foregoing-timer.glitch.me/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email, password })
//       });

//       const data = await response.json();
//       if (response.ok) {
//         alert('login successful!');
//         token = data.token;
//         setCurrentUser(email); 
//         if (chatContainer) chatContainer.style.display = 'flex'; 
//         if (loginRegisterContainer) loginRegisterContainer.style.display = 'none'; 

//         fetchAndDisplayMessages(); 
//       } else {
//         alert(data.msg);
//       }
//     } catch (error) {
//       console.error('Error during login:', error);
//       alert('Failed to login. Please try again later.');
//     }
//   });


//   // sendButton.addEventListener('click', async () => {
//   //   const message = messageInput.value.trim();
//   //   if (message&&ws) {
//   //     try {
//   //       ws.send(JSON.stringify({ token, text: message }));
//   //       messageInput.value = '';
//   //     } catch (error) {
//   //       console.error('Error sending message:', error);
//   //     }
//   //   }
//   // });

//   sendButton.addEventListener('click', async () => {
//     const message = messageInput.value.trim(); 
//     if (message) {
//       try {
//         const response = await fetch('https://sleet-foregoing-timer.glitch.me/addmessages', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`
//           },
//           body: JSON.stringify({ message })
//         });

//         if (response.ok) {
//           console.log('Message sent successfully');
//           messageInput.value = ''; 
//           const data = await response.json();
//           displayMessage(data.username, data.message, data.timestamp, data.email);
//         } else {
//           console.error('Failed to send message:', response.statusText);
//         }
//       } catch (error) {
//         console.error('Error sending message:', error);
//       }
//     }
//   });

//   // function initializeWebSocket() {
//   //   // const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
//   //   // const wsUrl = `${protocol}://${window.location.host}`;

//   //   // ws = new WebSocket(wsUrl);
//   //   const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
//   //   const wsUrl = `${protocol}://${window.location.hostname}:${window.location.port}`;
  
//   //   ws = new WebSocket(wsUrl)

//   //   ws.onopen = () => {
//   //     console.log('WebSocket connection established');
//   //   };

//   //   ws.onmessage = (event) => {
//   //     const { username, message, timestamp, email } = JSON.parse(event.data);
//   //     displayMessage(username, message, timestamp, email);
//   //   };

//   //   ws.onclose = () => {
//   //     console.log('WebSocket connection closed');
//   //     setTimeout(initializeWebSocket, 1000);
//   //   };

//   //   ws.onerror = (error) => {
//   //     console.error('WebSocket error:', error);
//   //   };
//   // }

//   function initializeWebSocket() {
//     const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
//     const host = window.location.hostname + (window.location.port ? ':' + window.location.port : '');
//     const wsUrl = `${protocol}://${host}`;
  
//     ws = new WebSocket(wsUrl);
  
//     ws.onopen = () => {
//       console.log('WebSocket connection established');
//     };
  
//     ws.onmessage = (event) => {
//       const { username, message, timestamp, email } = JSON.parse(event.data);
//       displayMessage(username, message, timestamp, email);
//     };
  
//     ws.onclose = () => {
//       console.log('WebSocket connection closed');
//       setTimeout(initializeWebSocket, 1000);
//     };
  
//     ws.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };
//   }
  

//   async function fetchAndDisplayMessages() {
//     try {
//       const response = await fetch('https://sleet-foregoing-timer.glitch.me/messages', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
//       }

//       const messages = await response.json();
//       messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
//       messages.forEach(message => displayMessage(message.username, message.message, message.timestamp, message.email));
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//       displayErrorMessage(error.message); 
//     }
//   }

//   function setCurrentUser(email) {
//     currentUserEmail = email;
//     localStorage.setItem('currentUserEmail', email); 
//   }

//   function getCurrentUser() {
//     currentUserEmail = localStorage.getItem('currentUserEmail');
//     return currentUserEmail;
//   }

//   function displayMessage(username, message, timestamp, email) {
//     const messageElement = document.createElement('div');
//     messageElement.classList.add('message');
//     const isCurrentUser = email === getCurrentUser();

//     const avatarCircle = document.createElement('div');
//     avatarCircle.classList.add('avatar-circle');
//     avatarCircle.textContent = username.slice(0, 2).toUpperCase();
//     messageElement.appendChild(avatarCircle);

//     const messageContent = document.createElement('div');
//     messageContent.classList.add('message-content');

//     const messageText = document.createElement('div');
//     messageText.classList.add('message-text');
//     messageText.textContent = message;
//     messageContent.appendChild(messageText);

//     const messageTime = document.createElement('div');
//     messageTime.classList.add('message-time');
//     const dateObj = new Date(timestamp);
//     const hours = dateObj.getHours().toString().padStart(2, '0');
//     const minutes = dateObj.getMinutes().toString().padStart(2, '0');
//     messageTime.textContent = `${hours}:${minutes}`;
//     messageContent.appendChild(messageTime);

//     messageElement.appendChild(messageContent);

//     if (isCurrentUser) {
//       messageElement.classList.add('current-user');
//     } else {
//       messageElement.classList.add('other-user');
//     }

//     messagesContainer.appendChild(messageElement);
//     messagesContainer.scrollTop = messagesContainer.scrollHeight;
//   }

//   function displayErrorMessage(errorMessage) {
//     const errorElement = document.createElement('div');
//     errorElement.classList.add('error');
//     errorElement.textContent = `Error: ${errorMessage}`;

//     messagesContainer.appendChild(errorElement);
//   }

//   // initializeWebSocket();
  

// });


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
  const username =document.getElementById('register-username')
  const email =document.getElementById('register-email')
  const password =document.getElementById('register-password')

  let ws = null;
initializeWebSocket();

  let token;
  let currentUserEmail; 

  loginBtn.style.backgroundColor = 'white';
  loginBtn.style.color = 'black';
  loginBtn.style.border='1px solid black'

  registerBtn.addEventListener('click', function() {
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
    chatContainer.style.display = 'none'; 

    registerBtn.style.backgroundColor = '#2196F3'; 
    registerBtn.style.color = 'white';
    loginBtn.style.backgroundColor = 'white'; 
    loginBtn.style.color = 'black';
    loginBtn.style.border='1px solid black'
    
    registerForm.style.display = 'block'; 
    loginForm.style.display = 'none';
    username.value="";
    email.value="";
    password.value=""


  });

  loginBtn.addEventListener('click', function() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    chatContainer.style.display = 'none'; 
    loginBtn.style.backgroundColor = '#2196F3'; 
    loginBtn.style.color = 'white';
    registerBtn.style.backgroundColor = 'white'; 
    registerBtn.style.color = 'black';
    registerBtn.style.border='1px solid black'
    
    loginForm.style.display = 'block'; 
    registerForm.style.display = 'none'; 
  });

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
        setCurrentUser(email); 
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        
        loginBtn.style.backgroundColor = 'blue'; 
        loginBtn.style.color = 'white';
        registerBtn.style.color = 'black';
        registerBtn.style.backgroundColor = 'white';
        registerBtn.style.border='1px solid black'
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Failed to register. Please try again later.');
    }
  });

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
        if (chatContainer) chatContainer.style.display = 'flex'; 
        if (loginRegisterContainer) loginRegisterContainer.style.display = 'none'; 

        // initializeWebSocket(); // Initialize WebSocket after login
        fetchAndDisplayMessages(); 
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Failed to login. Please try again later.');
    }
  });

//   sendButton.addEventListener('click', () => {
//     initializeWebSocket(); 
//     const message = messageInput.value;
//     if (message && ws) {
//         ws.send(JSON.stringify({ token, text: message }));
//         messageInput.value = '';
//     }
// });

sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message && ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ token, text: message }));
      messageInput.value = '';
  } else {
      console.error('WebSocket connection is not open or message is empty');
  }
});
  // sendButton.addEventListener('click', async () => {
  //   const message = messageInput.value.trim(); 
  //   if (message) {
  //     try {
  //       const response = await fetch('https://sleet-foregoing-timer.glitch.me/addmessages', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`
  //         },
  //         body: JSON.stringify({ message })
  //       });

  //       if (response.ok) {
  //         console.log('Message sent successfully');
  //         messageInput.value = ''; 
  //         const data = await response.json();
  //         displayMessage(data.username, data.message, data.timestamp, data.email);
  //       } else {
  //         console.error('Failed to send message:', response.statusText);
  //       }
  //     } catch (error) {
  //       console.error('Error sending message:', error);
  //     }
  //   }
  // });

  function initializeWebSocket() {

    const wsUrl = `wss://sleet-foregoing-timer.glitch.me/websocket`;
    ws = new WebSocket(wsUrl);
  
    ws.onopen = () => {
      console.log('WebSocket connection established');
    };
  
    ws.onmessage = (event) => {
      const { username, message, timestamp, email } = JSON.parse(event.data);
      displayMessage(username, message, timestamp, email);
    };

    // async function fetchAndDisplayMessages() {
    //   try {
    //     const response = await fetch('https://sleet-foregoing-timer.glitch.me/messages', {
    //       headers: {
    //         Authorization: `Bearer ${token}`
    //       }
    //     });
  
    //     if (!response.ok) {
    //       throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
    //     }
  
    //     const messages = await response.json();
    //     messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    //     messagesContainer.innerHTML = ''; // Clear the container before appending new messages
    //     messages.forEach(message => displayMessage(message.username, message.message, message.timestamp, message.email));
    //   } catch (error) {
    //     console.error('Error fetching messages:', error);
    //     displayErrorMessage(error.message); 
    //   }
    // }

    // fetchAndDisplayMessages()
  
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      // setTimeout(initializeWebSocket, 1000);
    };
  
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  async function fetchAndDisplayMessages() {
    try {
      const response = await fetch('https://sleet-foregoing-timer.glitch.me/messages', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
      }

      const messages = await response.json();
      messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      messagesContainer.innerHTML = ''; // Clear the container before appending new messages
      messages.forEach(message => displayMessage(message.username, message.message, message.timestamp, message.email));
    } catch (error) {
      console.error('Error fetching messages:', error);
      displayErrorMessage(error.message); 
    }
  }

  function setCurrentUser(email) {
    currentUserEmail = email;
    localStorage.setItem('currentUserEmail', email); 
  }

  function getCurrentUser() {
    currentUserEmail = localStorage.getItem('currentUserEmail');
    return currentUserEmail;
  }

  function displayMessage(username, message, timestamp, email) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    const isCurrentUser = email === getCurrentUser();

    const avatarCircle = document.createElement('div');
    avatarCircle.classList.add('avatar-circle');
    avatarCircle.textContent = username.slice(0, 2).toUpperCase();
    messageElement.appendChild(avatarCircle);

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
    } else {
      messageElement.classList.add('other-user');
    }

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function displayErrorMessage(errorMessage) {
    const errorElement = document.createElement('div');
    errorElement.classList.add('error');
    errorElement.textContent = `Error: ${errorMessage}`;

    messagesContainer.appendChild(errorElement);
  }

});
