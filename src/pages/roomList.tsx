import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { Oval } from "react-loader-spinner";

interface Room {
    id: string;
    name: string;
}

interface RoomListProps {
    rooms: Room[];
    onClose: () => void;
    onJoinRoom: (roomId: string) => void;
}

export default function RoomList({
    rooms,
    onClose,
    onJoinRoom,
}: RoomListProps) {
    const [loadingRoom, setLoadingRoom] = useState<string | null>(null);

    const handleJoinRoom = (roomId: string) => {
        setLoadingRoom(roomId);
        setTimeout(() => {
            onJoinRoom(roomId);
            setLoadingRoom(null);
        }, 1000);
    };

    return (
        <>
            <div className="w-[30rem] bg-white text-black rounded-xl flex flex-col justify-between gap-4 p-4 transition-transform duration-500 relative">
                <h1 className="text-3xl font-bold">Available Rooms</h1>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-red-700 rounded-full absolute top-0 right-0"
                >
                    <RxCross1 />
                </button>
                {rooms.length === 0 ? (
                    <p>No rooms available. Create a new one!</p>
                ) : (
                    <ul className="space-y-2">
                        {rooms.map((room) => (
                            <div
                                key={room.id}
                                className="flex justify-between items-center"
                            >
                                <span>{room.name}</span>
                                <li>
                                    <button
                                        onClick={() => handleJoinRoom(room.id)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        Join
                                    </button>
                                </li>
                            </div>
                        ))}
                    </ul>
                )}
            </div>

            {/* Full-screen loading overlay */}
            {loadingRoom && (
                <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
                    <div className="bg-white p-12 rounded-lg flex flex-col items-center">
                        <Oval
                            visible={true}
                            height="60"
                            width="60"
                            color="#3B82F6"
                            secondaryColor="#93C5FD"
                            ariaLabel="oval-loading"
                        />
                        <p className="mt-4 text-lg text-black">
                            Joining room:{" "}
                            {
                                rooms.find((room) => room.id === loadingRoom)
                                    ?.name
                            }
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
