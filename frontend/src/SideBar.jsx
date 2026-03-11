import React, { useContext, useEffect } from "react";
import "./SideBar.css";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";
import api from "./api/axios";

function SideBar() {
    const {
        allThreads,
        setAllThreads,
        currThreadId,
        setNewChat,
        setPrompt,
        setReply,
        setCurrThreadId,
        setPrevChats,
        prevChats,
        provider
    } = useContext(MyContext);

    const token = localStorage.getItem("token");

    const getAllThreads = async () => {
        try {
            const response = await api.get(`/threads`);
            const filteredData = response.data.map(thread => ({
                threadId: thread.threadId,
                title: thread.title
            }));
            setAllThreads(filteredData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId, allThreads]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    useEffect(() => {
        if (!currThreadId) {
            createNewChat();
        }
    }, []);

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        try {
            const response = await api.get(`/threads/${newThreadId}`);
            setPrevChats(response.data.messages);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            await api.delete(`/threads/${threadId}`);
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if (threadId === currThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <section className="sidebar">
            <button onClick={createNewChat} className="newChatBtn">
                <span>New Chat</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
            </button>

            <ul className="history">
                {allThreads?.map((thread, idx) => (
                    <li
                        key={idx}
                        onClick={() => changeThread(thread.threadId)}
                        className={thread.threadId === currThreadId ? "highlighted" : ""}
                    >
                        <span className="thread-title">{thread.title}</span>
                        <button
                            className="deleteBtn"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                <path d="M10 11v6"/>
                                <path d="M14 11v6"/>
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                        </button>
                    </li>
                ))}
            </ul>

            <div className="sign">
                <p>By Raghav Chugh &hearts;</p>
            </div>
        </section>
    );
}

export default SideBar;
