import { useState } from "react";
import "./App.css";
import SideBar from "./SideBar";
import ChatWindow from "./ChatWindow";
import { MyContext } from "./MyContext";
import { BrowserRouter,Route,Routes } from "react-router-dom";

function ChatGpt() {
  const [allThreads,setAllThreads]=useState([]);
  const [newChat,setNewChat]=useState(true);
  const [prompt,setPrompt]=useState("");
  const [reply,setReply]=useState(null);
  const [currThreadId,setCurrThreadId]=useState("");
  const [prevChats,setPrevChats]=useState([]);
  const [provider,setProvider]=useState("Gemini");
  const providerValues = {
    allThreads,setAllThreads,
    newChat,setNewChat,
    prompt,setPrompt,
    reply,setReply,
    currThreadId,setCurrThreadId,
    prevChats,setPrevChats,
    provider,setProvider
  };

  
  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <SideBar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

export default ChatGpt;
