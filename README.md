<h1 align="center" id="title">MERN Instant Messanger</h1>

<p id="description">An instant messaging application built with the MERN stack (MongoDB Express.js React Node.js) and Socket.IO for real-time communication.</p>

<h2>Project Screenshots:</h2>

<img src="https://github.com/jay-raut/MERN-Instant-Messanger/blob/main/Screenshot_26-7-2024_233951_localhost.jpeg?raw=true" alt="project-screenshot/">

<img src="https://github.com/jay-raut/MERN-Instant-Messanger/blob/main/Screenshot_26-7-2024_233731_localhost.jpeg?raw=true" alt="project-screenshot/">

<img src="https://github.com/jay-raut/MERN-Instant-Messanger/blob/main/Screenshot_26-7-2024_233834_localhost.jpeg?raw=true" alt="project-screenshot/">

<img src="https://github.com/jay-raut/MERN-Instant-Messanger/blob/main/Screenshot_26-7-2024_233846_localhost.jpeg?raw=true" alt="project-screenshot/">

  
  
<h2>🧐 Features</h2>

Here're some of the project's best features:

*   Real-Time Messaging: Instant communication enabled by Socket.IO.
*   Secure Sessions: Utilizes JSON Web Token (JWT) for session management and security.
*   One-on-One and Group Chats: Supports individual and group messaging.
*   Persistent Data Storage: Messages and chat information stored in MongoDB.

<h2>🛠️ Installation Steps:</h2>

<p>1. Setup env file with following environment variables in the backend directory</p>

```
mongo_cert="path to mongo cert"
```

```
mongo_db="address to cluster"
```

```
secret_token_key="JWT secret (can be anything)"
```

<p>2. Start the backend server using node</p>

```
node back-end-server.js
```

<p>3. Navigate to front-end/im-frontend folder and start the frontend service using npm</p>

```
npm start
```

  
  
<h2>💻 Built with</h2>

Technologies used in the project:

*   Backend: Node.js Express.js Socket.IO
*   Frontend: React Material UI
*   Database: MongoDB
*   Authentication: JSON Web Token (JWT)
