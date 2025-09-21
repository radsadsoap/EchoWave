import React, { useState } from "react";
import { VscSend } from "react-icons/vsc";
import { BsEmojiSmile } from "react-icons/bs";
import { IoMdAttach } from "react-icons/io";
import { useSocket } from "./socketContext";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

export default function SendMessage() {
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { sendMessage } = useSocket();

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            sendMessage(message);
            setMessage("");
        }
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    return (
        <div className="flex items-center text-xl px-4 py-2 border-t">
            <form
                onSubmit={handleSendMessage}
                className="flex justify-between w-full"
            >
                <div className=" flex gap-2 w-full">
                    <button
                        type="button"
                        className="p-2 rounded-md hover:bg-neutral-800 transition-colors"
                        onClick={toggleEmojiPicker}
                    >
                        <BsEmojiSmile />
                    </button>
                    {showEmojiPicker && (
                        <div className="absolute bottom-16">
                            <Picker set="apple" previewPosition="none" />
                        </div>
                    )}
                    <button
                        type="button"
                        className="p-2 rounded-md hover:bg-neutral-800 transition-colors"
                    >
                        <IoMdAttach />
                    </button>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message"
                        className="bg-transparent text-base text-white w-full outline-none"
                    />
                </div>
                <button
                    type="submit"
                    className="p-2 rounded-md hover:bg-neutral-800 transition-colors"
                >
                    <VscSend />
                </button>
            </form>
        </div>
    );
}
