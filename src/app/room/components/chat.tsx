import { useSocket, Message } from "./socketContext";
import { useEffect, useRef, useMemo } from "react";
import { auth } from "../../lib/firebaseConfig";

const USERNAME_COLORS = [
    "#E91E63", // Pink
    "#2196F3", // Blue
    "#FF9800", // Orange
    "#4CAF50", // Green
    "#9C27B0", // Purple
    "#00BCD4", // Cyan
    "#FFC107", // Amber
    "#3F51B5", // Indigo
    "#6bb300", // Lime
    "#795548", // Brown
    "#009688", // Teal
    "#673AB7", // Deep Purple
];

function getColorForUsername(username: string): string {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % USERNAME_COLORS.length;
    return USERNAME_COLORS[index];
}

function MessageBubble({ message }: { message: Message }) {
    const storedGuestUser = localStorage.getItem("guestUser");
    let currentUser = "";

    if (storedGuestUser) {
        const guestUser = JSON.parse(storedGuestUser);
        currentUser = guestUser.displayName || "Guest";
    } else {
        currentUser = auth.currentUser?.displayName || "Guest";
    }

    const isOwnMessage = message.sender === currentUser;
    const usernameColor = getColorForUsername(message.sender);

    return (
        <div
            className={`mb-2 flex ${
                isOwnMessage ? "justify-end" : "justify-start"
            }`}
            style={{ overflowWrap: "anywhere" }}
        >
            <div
                className={`flex flex-col ${
                    isOwnMessage
                        ? "bg-[#4e38a2] rounded-tr-sm"
                        : "bg-neutral-800 rounded-tl-sm"
                } text-white rounded-xl px-4 py-2 max-w-[70%] h-full`}
            >
                {!isOwnMessage && (
                    <div className="flex gap-1 items-baseline">
                        <span
                            className="font-bold"
                            style={{ color: usernameColor }}
                        >
                            {message.sender}
                        </span>
                    </div>
                )}
                <div className="flex items-end gap-2">
                    {message.message}
                    <span className="text-xs text-gray-500 text-nowrap">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function Chat() {
    const { messages } = useSocket();
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="max-h-full h-full overflow-y-auto flex flex-col">
            <div className="p-4 chat">
                {messages.map((message, index) => (
                    <MessageBubble key={index} message={message} />
                ))}
                <div ref={chatEndRef} />
            </div>
        </div>
    );
}
