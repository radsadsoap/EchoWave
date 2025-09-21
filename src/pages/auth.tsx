import React, { useState, useEffect, useRef } from "react";
import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    User,
    signInAnonymously,
    updateProfile,
} from "firebase/auth";
import { auth } from "../app/lib/firebaseConfig";
import Title from "./title";
import { FcGoogle } from "react-icons/fc";
import { FaSignOutAlt } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";

interface AuthComponentProps {
    onCreateRoom: () => void;
    onShowRoomList: () => void;
}

export interface CustomUser extends User {
    isGuest?: boolean;
}

const AuthComponent: React.FC<AuthComponentProps> = ({
    onCreateRoom,
    onShowRoomList,
}) => {
    const [user, setUser] = useState<CustomUser | null>(null);
    const [loading, setLoading] = useState(false);

    const signedInContentRef = useRef<HTMLDivElement>(null);
    const signedOutContentRef = useRef<HTMLDivElement>(null);
    const welcomeTextRef = useRef<HTMLParagraphElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const signOutButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                const customUser: CustomUser = {
                    ...firebaseUser,
                    isGuest: firebaseUser.isAnonymous,
                };
                setUser(customUser);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        setLoading(true);
        try {
            if (user && user.isAnonymous) {
                await signOut(auth);
            }
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google", error);
        } finally {
            setLoading(false);
        }
    };

    const guestLogin = async () => {
        setLoading(true);
        try {
            const guestNumber = Math.floor(Math.random() * 9000) + 1000;
            const guestName = `Guest${guestNumber}`;

            const anonymousUser = await signInAnonymously(auth);
            await updateProfile(anonymousUser.user, {
                displayName: guestName,
            });

            setUser({
                ...anonymousUser.user,
                isGuest: true,
                displayName: guestName,
            } as CustomUser);
        } catch (error) {
            console.error("Error signing in as guest:", error);
        } finally {
            setLoading(false);
        }
    };

    const signOutUser = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <div className="relative h-screen m-auto flex flex-col justify-center items-center">
            <Title />

            {loading ? (
                <ThreeDots
                    visible={true}
                    color="#4e98e7"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass="absolute bottom-1/4"
                />
            ) : user ? (
                <div
                    ref={signedInContentRef}
                    className="flex flex-col items-center"
                >
                    <p
                        ref={welcomeTextRef}
                        className="absolute top-[28%] text-3xl mb-4"
                    >
                        Welcome, {user.displayName?.split(" ")[0]}
                    </p>

                    <div
                        ref={buttonsRef}
                        className="absolute bottom-[20%] flex flex-col items-center"
                    >
                        <div className=" flex gap-3 text-xl">
                            <button
                                onClick={onCreateRoom}
                                className="w-32 bg-white text-black text-sm rounded-md hover:bg-black hover:text-white hover:outline-1 hover:outline-dashed hover:outline-white py-2  transition-all duration-[400ms]"
                            >
                                Create Room
                            </button>

                            <button
                                onClick={onShowRoomList}
                                className="w-32 bg-white text-black text-sm rounded-md hover:bg-black hover:text-white hover:outline-1 hover:outline-dashed hover:outline-white py-2  transition-all duration-[400ms]"
                            >
                                Join Room
                            </button>
                        </div>
                    </div>

                    <div
                        ref={signOutButtonRef}
                        className="absolute right-4 bottom-4"
                    >
                        <button
                            onClick={signOutUser}
                            className="px-3.5 py-1.5 rounded-md flex items-center gap-2 hover:text-white hover:bg-red-800 transition-all duration-300"
                        >
                            Sign Out
                            {/* <FaSignOutAlt /> */}
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    ref={signedOutContentRef}
                    className="absolute bottom-4 flex items-center gap-6"
                >
                    <button
                        onClick={signInWithGoogle}
                        className="text-lg pt-2 pb-1.5 px-4 rounded-full flex gap-3 items-center sign-in-button"
                    >
                        <FcGoogle size={25} className="mb-1" /> Sign in with
                        Google
                    </button>
                    <button
                        onClick={guestLogin}
                        className="text-lg pt-2 pb-1.5 px-4 rounded-full flex gap-3 items-center sign-in-button"
                    >
                        <FaUserAlt className="mb-1" /> Continue as Guest
                    </button>
                </div>
            )}
        </div>
    );
};

export default AuthComponent;
