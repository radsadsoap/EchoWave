import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { auth } from "../../lib/firebaseConfig";
import { CustomUser } from "../../../pages/auth";

interface SocketContextType {
    socket: Socket | null;
    messages: Message[];
    users: string[];
    sendMessage: (message: string) => void;
}

export interface Message {
    message: string;
    sender: string;
    timestamp: Date;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({
    children,
    roomId,
    isTemporary,
}: {
    children: React.ReactNode;
    roomId: string;
    isTemporary: boolean;
}) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<string[]>([]);

    useEffect(() => {
        const newSocket = io("http://localhost:3001");
        setSocket(newSocket);

        let username: string;
        const storedGuestUser = localStorage.getItem("guestUser");
        if (storedGuestUser) {
            const guestUser: CustomUser = JSON.parse(storedGuestUser);
            username = guestUser.displayName || "Guest";
        } else {
            username = auth.currentUser?.displayName || "Guest";
        }

        // Emit room creation information
        newSocket.emit("create_room", {
            roomId,
            isTemporary,
            createdBy: username,
        });

        // Join room
        newSocket.emit("join_room", { username, room: roomId });

        // Rest of the event handlers remain the same
        const handleNewMessage = (message: Message) => {
            message.timestamp = new Date(message.timestamp);
            setMessages((prevMessages) => {
                const isDuplicate = prevMessages.some(
                    (msg) =>
                        new Date(msg.timestamp).getTime() ===
                            message.timestamp.getTime() &&
                        msg.sender === message.sender &&
                        msg.message === message.message
                );
                if (!isDuplicate) {
                    return [...prevMessages, message];
                }
                return prevMessages;
            });
        };

        const handleRoomUsers = (roomUsers: { username: string }[]) => {
            setUsers(roomUsers.map((user) => user.username));
        };

        const handleChatHistory = (history: Message[]) => {
            setMessages(history);
        };

        newSocket.on("receive_message", handleNewMessage);
        newSocket.on("room_users", handleRoomUsers);
        newSocket.on("chat_history", handleChatHistory);

        newSocket.emit("get_chat_history", roomId);

        return () => {
            newSocket.off("receive_message", handleNewMessage);
            newSocket.off("room_users", handleRoomUsers);
            newSocket.off("chat_history", handleChatHistory);
            newSocket.disconnect();
        };
    }, [roomId, isTemporary]);

    const sendMessage = (message: string) => {
        if (socket) {
            let username: string;
            const storedGuestUser = localStorage.getItem("guestUser");
            if (storedGuestUser) {
                const guestUser: CustomUser = JSON.parse(storedGuestUser);
                username = guestUser.displayName || "Guest";
            } else {
                username = auth.currentUser?.displayName || "Guest";
            }

            const messageData: Message = {
                message,
                sender: username,
                timestamp: new Date(),
            };

            socket.emit("send_message", {
                room: roomId,
                ...messageData,
            });
        }
    };

    return (
        <SocketContext.Provider
            value={{ socket, messages, users, sendMessage }}
        >
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
}
