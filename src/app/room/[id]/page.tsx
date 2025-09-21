"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { RxCross1 } from "react-icons/rx";
import Chat from "../components/chat";
import SendMessage from "../components/sendMessage";
import { SocketProvider, useSocket } from "../components/socketContext";
import { auth } from "../../lib/firebaseConfig";
import { BiUser } from "react-icons/bi";
import { ThreeDots } from "react-loader-spinner";
import { FiUser } from "react-icons/fi";

interface RoomData {
    name: string;
    isPasswordProtected: boolean;
}

function RoomContent() {
    const router = useRouter();
    const params = useParams();
    const roomId = params.id as string;
    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { socket } = useSocket();

    useEffect(() => {
        async function fetchRoomData() {
            try {
                const roomDoc = await getDoc(doc(db, "rooms", roomId));
                if (roomDoc.exists()) {
                    setRoomData(roomDoc.data() as RoomData);
                } else {
                    setError("Room not found");
                }
            } catch (err) {
                setError("Failed to fetch room data");
                console.error("Error fetching room:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchRoomData();
    }, [roomId]);

    const leaveRoom = () => {
        if (socket) {
            const username = auth.currentUser?.displayName || "Guest";
            socket.emit("leave_room", { username, room: roomId });
        }
    };

    const handleBack = () => {
        leaveRoom();
        router.push("/"); // Navigate to the home page or wherever the room list is
    };

    if (loading)
        return (
            <ThreeDots
                visible={true}
                color="#4e98e7"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
        );
    if (error) return <div className="p-6">Error: {error}</div>;
    if (!roomData) return <div className="p-6">Room not found</div>;

    const { users } = useSocket();

    return (
        <div className="h-screen bg-[#151617] flex flex-col justify-between flex-1 text-white font-[Modernist]">
            <div className="flex flex-col justify-center pl-4 pr-2 py-2 border-b">
                <div className="flex justify-between text-lg items-center">
                    <div className="flex gap-2">
                        <div className="flex gap-4 items-center">
                            <h1>Room: {roomData.name}</h1>
                        </div>
                        <h1 className="flex items-center gap-1 bg-white text-black px-2 rounded-md">
                            <FiUser /> {users.length}
                        </h1>
                    </div>
                    <button
                        onClick={handleBack}
                        className="hover:bg-gray-100 hover:text-black p-1 rounded-md transition-colors"
                        aria-label="Leave room"
                    >
                        <RxCross1 />
                    </button>
                </div>
            </div>
            <Chat />
            <SendMessage />
        </div>
    );
}

export default function RoomPage() {
    const params = useParams();
    const roomId = params.id as string;

    return (
        <SocketProvider roomId={roomId} isTemporary={false}>
            <RoomContent />
        </SocketProvider>
    );
}
