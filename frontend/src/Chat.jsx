import "./Chat.css";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const { newChat, prevChats, reply, provider } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    const stored = localStorage.getItem("user");
    const storedUser = JSON.parse((stored && stored !== "undefined") ? stored : "{}");
    const userInitial = storedUser.name ? storedUser.name[0].toUpperCase() : "U";
    const aiLogo = provider === "OpenAI" ? "/images/chatgpt.png" : "/images/gemini.jpg";

    useEffect(() => {
        if (!reply) {
            setLatestReply(null);
            return;
        }

        if (!prevChats?.length) return;

        const words = reply.split(" ");
        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(words.slice(0, idx + 1).join(" "));
            idx++;
            if (idx >= words.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);
    }, [prevChats, reply]);

    return (
        <>
            {newChat && (
                <div className="emptyState">
                    <h2 className="emptyStateTitle">What can I help you with?</h2>
                    <p className="emptyStateSubtitle">Type a message below to start a conversation.</p>
                </div>
            )}

            <div className="chats">
                {prevChats?.slice(0, -1).map((chat, idx) => (
                    <div className={`messageContainer ${chat.role === "user" ? "userContainer" : "assistantContainer"}`} key={idx}>
                        <div className={`messageWrapper ${chat.role === "user" ? "userWrapper" : "assistantWrapper"}`}>
                            <div className={`messageBubble ${chat.role === "user" ? "userBubble" : "assistantBubble"}`}>
                                {chat.role === "user"
                                    ? <p className="messageText">{chat.content}</p>
                                    : <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                                }
                            </div>
                            {chat.role === "user" && (
                                <div className="avatarBox userAvatarBox">{userInitial}</div>
                            )}
                            {chat.role === "assistant" && (
                                <div className="avatarBox assistantAvatar">
                                    <img src={aiLogo} alt={provider} className="avatarLogo" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {prevChats?.length > 0 && (
                    latestReply === null ? (
                        <div className="messageContainer assistantContainer">
                            <div className="messageWrapper assistantWrapper">
                                <div className="messageBubble assistantBubble">
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length - 1].content}</ReactMarkdown>
                                </div>
                                <div className="avatarBox assistantAvatar">
                                    <img src={aiLogo} alt={provider} className="avatarLogo" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="messageContainer assistantContainer">
                            <div className="messageWrapper assistantWrapper">
                                <div className="messageBubble assistantBubble">
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                </div>
                                <div className="avatarBox assistantAvatar">
                                    <img src={aiLogo} alt={provider} className="avatarLogo" />
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
        </>
    );
}

export default Chat;
