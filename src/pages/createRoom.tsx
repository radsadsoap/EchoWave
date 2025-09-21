import { useState } from "react";
import { db } from "../app/lib/firebaseConfig";
import { collection, addDoc, doc, deleteDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import { Oval } from "react-loader-spinner";
import { RxCross1 } from "react-icons/rx";

interface CustomUser {
    uid: string;
    isGuest: boolean;
    displayName: string | null;
}

interface CreateRoomProps {
    onClose: () => void;
    onRoomCreated: (roomId: string, roomName: string) => void;
    user: CustomUser | null;
}

export function CreateRoom({ onClose, onRoomCreated, user }: CreateRoomProps) {
    const router = useRouter();
    const [roomName, setRoomName] = useState("");
    const [isPasswordProtected, setIsPasswordProtected] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!roomName.trim()) {
            setError("Room name is required");
            setIsLoading(false);
            return;
        }

        if (isPasswordProtected && !password.trim()) {
            setError("Password is required when protection is enabled");
            setIsLoading(false);
            return;
        }

        try {
            const roomsRef = collection(db, "rooms");
            const isTemporary = user?.isGuest ?? false;

            const roomData = {
                name: roomName,
                isPasswordProtected,
                password: isPasswordProtected ? password : null,
                createdAt: new Date(),
                createdBy: user?.uid || "guest",
                isTemporary,
                lastAccessed: new Date(),
            };

            const docRef = await addDoc(roomsRef, roomData);
            const roomId = docRef.id;

            if (isTemporary) {
                // Handle cleanup for temporary rooms
                if (typeof window !== "undefined") {
                    window.addEventListener("beforeunload", async () => {
                        try {
                            await deleteDoc(doc(db, "rooms", roomId));
                        } catch (error) {
                            console.error(
                                "Error deleting temporary room:",
                                error
                            );
                        }
                    });
                }
            }

            onRoomCreated(roomId, roomName);
        } catch (err) {
            console.error("Error creating room:", err);
            let errorMessage =
                "An unexpected error occurred. Please try again.";

            if (err instanceof FirebaseError) {
                if (err.code === "permission-denied") {
                    errorMessage =
                        "Permission denied. Please make sure you're logged in.";
                } else {
                    errorMessage = `Failed to create room: ${err.message}`;
                }
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className={`w-[30rem] bg-white text-black rounded-xl flex flex-col justify-between gap-4 p-4 transition-transform duration-500 ${
                isLoading ? "scale-98" : "scale-100"
            } relative`}
        >
            <h1 className="text-3xl font-bold">Create a New Room</h1>
            <button
                type="button"
                onClick={onClose}
                className="text-red-700 rounded-full absolute top-0 right-0"
                disabled={isLoading}
            >
                <RxCross1 />
            </button>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">
                        Room Name:
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            className="w-full border rounded px-2 py-1 text-black outline-none"
                            required
                        />
                    </label>
                </div>
                <div>
                    <label className="flex gap-2 items-center mb-2">
                        <input
                            type="checkbox"
                            checked={isPasswordProtected}
                            onChange={(e) =>
                                setIsPasswordProtected(e.target.checked)
                            }
                        />
                        Private
                    </label>
                </div>
                <div
                    className={`transition-all duration-500 ${
                        isPasswordProtected
                            ? "max-h-40 opacity-100"
                            : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                >
                    {isPasswordProtected && (
                        <div className="mb-2">
                            <label className="block mb-2">
                                Password:
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="w-full border rounded px-2 py-1"
                                    required
                                />
                            </label>
                        </div>
                    )}
                </div>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <div className="flex flex-col gap-2 items-end">
                    <button
                        type="submit"
                        className="px-3 pt-2 py-1.5 text-left bg-blue-500 text-white rounded-md transition-transform duration-500"
                    >
                        {isLoading ? (
                            <div className="flex justify-between items-center gap-2 transition-transform duration-500">
                                Create Room
                                <Oval
                                    visible={true}
                                    height="20"
                                    width="20"
                                    color="#fff"
                                    ariaLabel="oval-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                />
                            </div>
                        ) : (
                            "Create Room"
                        )}
                    </button>
                    {user?.isGuest && (
                        <p className="text-sm pt-2 text-red-600">
                            Note: As a guest user, this room will be temporary
                            and will be deleted when you close the browser.
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}
