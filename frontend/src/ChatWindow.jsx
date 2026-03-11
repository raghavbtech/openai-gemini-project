import React from "react";
import "./ChatWindow.css";
import { MyContext } from "./MyContext";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import Chat from "./Chat";
import api from "./api/axios";
import { useNavigate } from "react-router-dom";

function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat, provider, setProvider } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userInitial = storedUser.name ? storedUser.name[0].toUpperCase() : "U";

    const getReply = async () => {
        if (!token) {
            navigate("/login");
            return;
        }

        setLoading(true);
        setNewChat(false);
        try {
            if (provider == "OpenAI") {
                // Subscription expired. To re-enable, remove this block and uncomment the API call below.
                setLoading(false);
                setPrevChats(prev => [...prev,
                    { role: "user", content: prompt },
                    { role: "assistant", content: "⚠️ OpenAI subscription has expired. Please switch to **Gemini** to continue chatting." }
                ]);
                setPrompt("");
                return;
                // const response = await api.post("/threads", { message: prompt, threadId: currThreadId, provider: provider });
                // console.log(response.data.reply);
                // setReply(response.data.reply);
            }
            else if (provider == "Gemini") {
                const response = await api.post("/threads", {
                    message: prompt,
                    threadId: currThreadId,
                    provider: provider
                });
                setReply(response.data.reply);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => ([
                ...prevChats,
                { role: "user", content: prompt },
                { role: "assistant", content: reply }
            ]));
        }
        setPrompt("");
    }, [reply, provider]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="chatWindow">
            <div className="navbar">
                <div className="modelSelector">
                    <button className="modelButton" onClick={() => setIsModelOpen(!isModelOpen)}>
                        <img
                            src={provider === "OpenAI" ? "/images/chatgpt.png" : "/images/gemini.jpg"}
                            alt={provider}
                            className="modelLogo"
                        />
                        <span className="modelName">{provider}</span>
                        <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            {isModelOpen
                                ? <polyline points="18 15 12 9 6 15"/>
                                : <polyline points="6 9 12 15 18 9"/>
                            }
                        </svg>
                    </button>
                    {isModelOpen && (
                        <div className="modelDropdown">
                            <div className="modelOption" onClick={() => { setProvider("Gemini"); setIsModelOpen(false); }}>
                                <img src="/images/gemini.jpg" alt="Gemini" className="modelOptionLogo" />
                                <span>Gemini</span>
                            </div>
                            <div className="modelOption" onClick={() => { setProvider("OpenAI"); setIsModelOpen(false); }}>
                                <img src="/images/chatgpt.png" alt="OpenAI" className="modelOptionLogo" />
                                <span>OpenAI</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="userAvatar" onClick={() => setIsOpen(!isOpen)}>
                    {userInitial}
                </div>
            </div>

            {isOpen && (
                <div className="profileDropdown">
                    <div className="profileOption">Settings</div>
                    <div className="profileOption">Upgrade Plan</div>
                    <div className="profileDivider"></div>
                    <div className="profileOption logoutOption" onClick={handleLogout}>Log out</div>
                </div>
            )}

            <Chat />

            {loading && (
                <div className="loadingContainer">
                    <ScaleLoader color="#6c5ce7" loading={loading} />
                </div>
            )}

            <div className="chatInputContainer">
                <div className="inputWrapper">
                    <input
                        placeholder="Message..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" ? getReply() : ""}
                        className="chatInputField"
                    />
                    <button className="sendButton" onClick={getReply}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"/>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                    </button>
                </div>
                <p className="infoText">AI responses may be inaccurate. Please verify important information.</p>
            </div>
        </div>
    );
}

export default ChatWindow;
