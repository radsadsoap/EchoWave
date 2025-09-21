"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { auth, db } from "../app/lib/firebaseConfig";
import AuthComponent from "../pages/auth";
import RoomList from "../pages/roomList";
import { CreateRoom } from "../pages/createRoom";

interface Room {
    id: string;
    name: string;
    isTemporary?: boolean;
}

interface CustomUser {
    uid: string;
    isGuest: boolean;
    displayName: string | null;
}

export default function Home() {
    const router = useRouter();
    const [showCreateRoom, setShowCreateRoom] = useState(false);
    const [showRoomList, setShowRoomList] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [user, setUser] = useState<CustomUser | null>(null);

    const portalRef = useRef(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const onClose = () => {
        setShowCreateRoom(false);
        setShowRoomList(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                contentRef.current &&
                !contentRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        const handleDownKey = (event: KeyboardEvent) => {
            if (event.key == "Escape") {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleDownKey);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleDownKey);
        };
    }, []);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    isGuest: firebaseUser.isAnonymous,
                    displayName: firebaseUser.displayName,
                });
            } else {
                setUser(null);
            }
        });

        return () => {
            unsubscribeAuth();
        };
    }, []);

    useEffect(() => {
        let unsubscribeRooms: () => void;

        if (user) {
            const q = query(
                collection(db, "rooms"),
                where("isTemporary", "==", false)
            );
            unsubscribeRooms = onSnapshot(
                q,
                (querySnapshot) => {
                    const roomsData: Room[] = [];
                    querySnapshot.forEach((doc) => {
                        roomsData.push({
                            id: doc.id,
                            name: doc.data().name,
                            isTemporary: doc.data().isTemporary,
                        });
                    });
                    setRooms(roomsData);
                },
                (error) => {
                    console.error("Error fetching rooms:", error);
                }
            );
        } else {
            setRooms([]);
        }

        return () => {
            if (unsubscribeRooms) {
                unsubscribeRooms();
            }
        };
    }, [user]);

    const handleRoomCreated = (roomId: string) => {
        setShowCreateRoom(false);
        router.push(`/room/${roomId}`);
    };

    const handleJoinRoom = (roomId: string) => {
        router.push(`/room/${roomId}`);
    };

    const handleCreateRoom = () => {
        if (user) {
            setShowCreateRoom(true);
        } else {
            console.error("User must be authenticated to create a room");
        }
    };

    const handleShowRoomList = () => {
        if (user) {
            setShowRoomList(true);
        } else {
            console.error("User must be authenticated to view room list");
        }
    };

    return (
        <div className="relative">
            <AuthComponent
                onCreateRoom={handleCreateRoom}
                onShowRoomList={handleShowRoomList}
            />

            {showCreateRoom && user && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                    ref={portalRef}
                >
                    <div className="bg-white p-6 rounded-lg" ref={contentRef}>
                        <CreateRoom
                            onClose={() => setShowCreateRoom(false)}
                            onRoomCreated={handleRoomCreated}
                            user={user}
                        />
                    </div>
                </div>
            )}

            {showRoomList && user && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                    ref={portalRef}
                >
                    <div className="bg-white p-6 rounded-lg" ref={contentRef}>
                        <RoomList
                            rooms={rooms}
                            onClose={() => setShowRoomList(false)}
                            onJoinRoom={handleJoinRoom}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
