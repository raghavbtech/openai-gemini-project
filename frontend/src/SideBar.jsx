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
            console.log(response.data);
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
            <button onClick={createNewChat}>
                <img
                    src={provider === "OpenAI" ? "/images/chatgpt.png" : "/images/gemini.jpg"}
                    alt="AI logo"
                    className="logo"
                />
                <span>
                    <i className="fa-solid fa-pen-to-square"></i>
                </span>
            </button>

            <ul className="history">
                {allThreads?.map((thread, idx) => (
                    <li
                        key={idx}
                        onClick={(e) => changeThread(thread.threadId)}
                        className={thread.threadId === currThreadId ? "highlighted" : ""}
                    >
                        <span className="thread-title">{thread.title}</span>
                        <i
                            className="fa-solid fa-trash"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}
                        ></i>
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
