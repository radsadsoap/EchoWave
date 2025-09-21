import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const ORIGIN = process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:3000",
];

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ORIGIN,
        methods: ["GET", "POST"],
    },
});

// MongoDB Connection
mongoose
    .connect(process.env.MONGODB_URI as string)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB", err));

// Message Schema
const messageSchema = new mongoose.Schema({
    id: String,
    room: String,
    message: String,
    sender: String,
    timestamp: Date,
});

const Message = mongoose.model("Message", messageSchema);

interface User {
    socketId: string;
    username: string;
    room: string;
}

interface Room {
    id: string;
    name: string;
    createdBy: string;
    isTemporary: boolean;
    isPasswordProtected: boolean;
    passwordHash?: string; // Changed from password to passwordHash
}

const users: User[] = [];
const rooms: Room[] = [];
const temporaryRoomMessages: { [roomId: string]: any[] } = {};

io.on("connection", async (socket) => {
    socket.on(
        "create_room",
        async (data: {
            roomId: string;
            name: string;
            isTemporary: boolean;
            createdBy: string;
            isPasswordProtected: boolean;
            password?: string;
        }) => {
            const {
                roomId,
                name,
                isTemporary,
                createdBy,
                isPasswordProtected,
                password,
            } = data;

            let passwordHash: string | undefined;
            if (isPasswordProtected && password) {
                passwordHash = await bcrypt.hash(password, 10);
            }

            rooms.push({
                id: roomId,
                name,
                createdBy,
                isTemporary,
                isPasswordProtected,
                passwordHash,
            });

            socket.emit("room_created", { roomId });
        }
    );

    socket.on("join_room", async (data) => {
        const { username, room, password } = data;
        const roomData = rooms.find((r) => r.id === room);

        if (!roomData) {
            socket.emit("join_room_error", "Room not found");
            return;
        }

        if (roomData.isPasswordProtected && roomData.passwordHash) {
            if (!password) {
                socket.emit("join_room_error", "Password required");
                return;
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                roomData.passwordHash
            );
            if (!isPasswordValid) {
                socket.emit("join_room_error", "Incorrect password");
                return;
            }
        }

        socket.join(room);
        users.push({
            socketId: socket.id,
            username,
            room,
        });

        socket.emit("join_room_success");
        socket.to(room).emit("user_joined", username);

        const roomUsers = users.filter((user) => user.room === room);
        io.to(room).emit("room_users", roomUsers);
    });

    socket.on("send_message", async (data) => {
        const { room, message, sender } = data;
        const roomData = rooms.find((r) => r.id === room);

        const messageData = {
            id: uuidv4(),
            room,
            message,
            sender,
            timestamp: new Date(),
        };

        if (roomData?.isTemporary) {
            // Store message in memory for temporary rooms
            if (!temporaryRoomMessages[room]) {
                temporaryRoomMessages[room] = [];
            }
            temporaryRoomMessages[room].push(messageData);
        } else {
            // Store message in MongoDB for permanent rooms
            try {
                const newMessage = new Message(messageData);
                await newMessage.save();
            } catch (error) {
                console.error("Error saving message to database:", error);
            }
        }

        // Emit the message to all users in the room
        io.to(room).emit("receive_message", messageData);
    });

    socket.on("get_chat_history", async (room) => {
        const roomData = rooms.find((r) => r.id === room);

        try {
            let messages;
            if (roomData?.isTemporary) {
                // Retrieve messages from memory for temporary rooms
                messages = temporaryRoomMessages[room] || [];
            } else {
                // Retrieve messages from MongoDB for permanent rooms
                messages = await Message.find({ room }).sort("timestamp");
            }
            socket.emit("chat_history", messages);
        } catch (error) {
            console.error("Error fetching chat history:", error);
            socket.emit("chat_history", []);
        }
    });

    socket.on("disconnect", () => {
        const index = users.findIndex((user) => user.socketId === socket.id);
        if (index !== -1) {
            const user = users[index];
            users.splice(index, 1);

            const roomData = rooms.find((r) => r.id === user.room);
            if (roomData?.isTemporary) {
                const roomUsers = users.filter((u) => u.room === user.room);
                if (roomUsers.length === 0) {
                    // Clean up temporary room data when last user leaves
                    delete temporaryRoomMessages[user.room];
                    const roomIndex = rooms.findIndex(
                        (r) => r.id === user.room
                    );
                    if (roomIndex !== -1) {
                        rooms.splice(roomIndex, 1);
                    }
                }
            }

            socket.to(user.room).emit("user_left", user.username);
            const roomUsers = users.filter((u) => u.room === user.room);
            io.to(user.room).emit("room_users", roomUsers);
        }
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
