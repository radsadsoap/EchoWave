# 🌊 EchoWave

**Real-time Chat Application with Modern Web Technologies**

EchoWave is a full-featured, real-time chat application that enables users to create and join chat rooms, communicate instantly, and manage their online presence. Built with modern web technologies, it offers both Google authentication and guest access for seamless user onboarding.

## ✨ Features

### 🔐 **Authentication System**

-   **Google OAuth Integration** - Sign in with your Google account
-   **Guest Access** - Join as a guest with auto-generated usernames
-   **Persistent Sessions** - Stay logged in across browser sessions

### 💬 **Real-Time Messaging**

-   **Instant Message Delivery** - Powered by Socket.io for real-time communication
-   **Message History** - Persistent chat history stored in MongoDB
-   **Emoji Support** - Express yourself with a full emoji picker
-   **Message Timestamps** - See when messages were sent

### 🏠 **Room Management**

-   **Create Rooms** - Set up public or password-protected chat rooms
-   **Join Existing Rooms** - Browse and join available chat rooms
-   **Temporary Rooms** - Guest users create temporary rooms that auto-delete
-   **Permanent Rooms** - Authenticated users can create persistent rooms
-   **Password Protection** - Secure rooms with bcrypt-encrypted passwords

### 👥 **User Experience**

-   **Live User List** - See who's currently in each room
-   **Responsive Design** - Works seamlessly on desktop and mobile
-   **Modern UI** - Clean, intuitive interface with Tailwind CSS
-   **Loading States** - Smooth loading animations and feedback

## 🚀 Tech Stack

### **Frontend**

-   **Next.js 14** - React framework with App Router
-   **TypeScript** - Type-safe development
-   **Tailwind CSS** - Utility-first CSS framework
-   **React Icons** - Beautiful icon library
-   **GSAP** - Advanced animations

### **Backend**

-   **Express.js** - Node.js web framework
-   **Socket.io** - Real-time bidirectional communication
-   **MongoDB & Mongoose** - NoSQL database with ODM
-   **bcryptjs** - Password hashing and security

### **Authentication & Database**

-   **Firebase Auth** - Google OAuth and anonymous authentication
-   **Firestore** - Real-time NoSQL database for room metadata
-   **MongoDB** - Message storage and persistence

### **Development Tools**

-   **ESLint** - Code linting and formatting
-   **PostCSS** - CSS processing
-   **ts-node** - TypeScript execution environment

## 📦 Installation

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn
-   MongoDB database
-   Firebase project with Authentication enabled

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/echowave.git
cd echowave
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Server Configuration
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing one
3. Enable Authentication with Google provider
4. Create a Firestore database
5. Add your domain to authorized domains

### 5. MongoDB Setup

1. Set up MongoDB locally or use MongoDB Atlas
2. Create a database for the application
3. Update the `MONGODB_URI` in your `.env.local` file

## 🎯 Usage

### Development Mode

```bash
# Start the Next.js development server
npm run dev

# In a separate terminal, start the Socket.io server
npm run server
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
# Build the application
npm run build

# Start the production server
npm start

# Start the Socket.io server
npm run server
```

## 🏗️ Project Structure

```
echowave/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── lib/
│   │   │   └── firebaseConfig.ts # Firebase configuration
│   │   └── room/
│   │       ├── [id]/
│   │       │   └── page.tsx     # Dynamic room page
│   │       └── components/
│   │           ├── chat.tsx     # Chat interface
│   │           ├── sendMessage.tsx # Message input
│   │           └── socketContext.tsx # Socket.io context
│   └── pages/
│       ├── auth.tsx             # Authentication component
│       ├── createRoom.tsx       # Room creation form
│       ├── roomList.tsx         # Available rooms list
│       └── title.tsx            # App title component
├── server.ts                    # Socket.io server
├── package.json
└── README.md
```

## 🎮 How to Use

### 1. **Getting Started**

-   Visit the application homepage
-   Choose to sign in with Google or continue as a guest

### 2. **Creating a Room**

-   Click "Create Room" after authentication
-   Enter a room name
-   Optionally set a password for privacy
-   Click "Create Room" to generate your chat space

### 3. **Joining a Room**

-   Click "Join Room" to see available rooms
-   Select a room from the list
-   Enter password if the room is protected
-   Start chatting instantly!

### 4. **Chatting**

-   Type messages in the input field at the bottom
-   Press Enter or click the send button
-   Use the emoji picker to add expressions
-   See real-time messages from other users

### 5. **Room Features**

-   View active users in the current room
-   See message timestamps
-   Leave room using the "X" button

## 🔧 API Endpoints

### Socket.io Events

**Client to Server:**

-   `create_room` - Create a new chat room
-   `join_room` - Join an existing room
-   `send_message` - Send a message to the room
-   `get_chat_history` - Retrieve message history
-   `leave_room` - Leave the current room

**Server to Client:**

-   `room_created` - Room creation confirmation
-   `join_room_success` - Successful room join
-   `join_room_error` - Room join error
-   `receive_message` - New message received
-   `user_joined` - User joined notification
-   `user_left` - User left notification
-   `room_users` - Updated user list
-   `chat_history` - Historical messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   Socket.io team for real-time communication capabilities
-   Firebase team for authentication and database services
-   Next.js team for the amazing React framework
-   MongoDB team for reliable data storage
-   All contributors and users of EchoWave

---

**Built with ❤️ by [Your Name]**

_Happy Chatting! 🌊_
