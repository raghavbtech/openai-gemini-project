import React from "react";
import "./ChatWindow.css";
import { MyContext } from "./MyContext";
import { useContext,useState,useEffect } from "react";
import {ScaleLoader} from "react-spinners";
import Chat from "./Chat";
import api from "./api/axios";
import { useNavigate } from "react-router-dom";

function ChatWindow(){
    const {prompt,setPrompt,reply,setReply,currThreadId,setPrevChats,setNewChat,provider,setProvider}=useContext(MyContext);
    const [loading,setLoading]=useState(false);
    const [isOpen,setIsOpen]=useState(false);
    const [isModelOpen,setIsModelOpen]=useState(false);
    const navigate=useNavigate();
    const token=localStorage.getItem("token");

    const getReply=async()=>{
        if(!token){
            navigate("/login");
            return;
        }
        setLoading(true);
        setNewChat(false);
        console.log("message ",prompt," threadId ",currThreadId,provider);
        try {
            if(provider=="OpenAI"){
                const response=await api.post("/threads",{
                message:prompt,
                threadId:currThreadId,
                provider:provider
            })
            console.log(response.data.reply);
            setReply(response.data.reply);
            }
            else if(provider=="Gemini"){
                const response=await api.post("/threads",{
                    message:prompt,
                    threadId:currThreadId,
                    provider:provider
                });
                console.log(response)
                setReply(response.data.reply);
            }

        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    useEffect(()=>{
        if(prompt && reply){
            setPrevChats(prevChats=>(
                [...prevChats,{
                    role:"user",
                    content:prompt
                },{
                    role:"assistant",
                    content:reply
                }]
            ))
        }
        setPrompt("");
    },[reply,provider]);

    const handleProfileClick=()=>{
        setIsOpen(!isOpen);
    }

    const handleLogout=()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }


    return(
       <div className="chatWindow">
        <div className="navbar">
            <div className="modelSelector">
                <button className="modelButton" onClick={(e)=>setIsModelOpen(!isModelOpen)}>
                    <span className="modelIcon">
                        {provider === "OpenAI" ? "🤖" : "✨"}
                    </span>
                    <span className="modelName">{provider}</span>
                    <i className={`fa-solid fa-chevron-${isModelOpen ? 'up' : 'down'} chevronIcon`}></i>
                </button>
                {
                    isModelOpen &&
                    <div className="modelDropdown">
                        <div className="modelOption" onClick={(e)=>{setProvider("Gemini");setIsModelOpen(!isModelOpen);}}>
                            <span className="modelOptionIcon">✨</span>
                            <span>Gemini</span>
                        </div>
                        <div className="modelOption" onClick={(e)=>{setProvider("OpenAI");setIsModelOpen(!isModelOpen)}}>
                            <span className="modelOptionIcon">🤖</span>
                            <span>OpenAI</span>
                        </div>
                    </div>
                }
            </div>
            <div className="profileSection" onClick={handleProfileClick}>
                <div className="userAvatar">
                    <i className="fa-solid fa-user"></i>
                </div>
            </div>
        </div>
        {
            isOpen &&
            <div className="profileDropdown">
                <div className="profileArrow"></div>
                <div className="profileOption">
                    <i className="fa-solid fa-gear"></i>
                    <span>Settings</span>
                </div>
                <div className="profileOption">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <span>Upgrade Plan</span>
                </div>
                <div className="profileDivider"></div>
                <div className="profileOption logoutOption" onClick={handleLogout}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    <span>Log out</span>
                </div>
            </div>
        }
        <Chat></Chat>

        {loading && (
            <div className="loadingContainer">
                <ScaleLoader color="#00d4ff" loading={loading}></ScaleLoader>
            </div>
        )}

         <div className="chatInputContainer">
            <div className="inputWrapper">
                <input
                    placeholder="Type your message here..."
                    value={prompt}
                    onChange={(e)=>setPrompt(e.target.value)}
                    onKeyDown={(e)=>e.key==='Enter'?getReply():''}
                    className="chatInputField"
                />
                <button className="sendButton" onClick={getReply}>
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
            </div>
            <p className="infoText">
                AI responses may be inaccurate. Please verify important information.
            </p>
        </div>

       </div>


    )
}

export default ChatWindow;
