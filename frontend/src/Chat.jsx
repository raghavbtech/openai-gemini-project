import "./Chat.css";
import React,{useContext,useState,useEffect} from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";


function Chat()
{
    const {newChat,prevChats,reply,provider}=useContext(MyContext);
    const [latestReply,setLatestReply]=useState(null);

    useEffect(()=>{
        if(reply===null){
            setLatestReply(null);
            return;
        }

        if(!prevChats?.length)return;


        const content=reply.split(" ");
        let idx=0;
        const interval=setInterval(()=>{
            setLatestReply(content.slice(0,idx+1).join(" "));
            idx++;
            if(idx>=content.length)clearInterval(interval);
        },40);
        return ()=>clearInterval(interval);

    },[prevChats,reply]);

    return(
        <>
        {newChat && (
            <div className="emptyState">
                <div className="emptyStateIcon">💬</div>
                <h1 className="emptyStateTitle">Ready to Chat</h1>
                <p className="emptyStateSubtitle">Ask me anything and I'll help you out</p>
            </div>
        )}
        <div className="chats">
            {
                prevChats?.slice(0,-1).map((chat,idx)=>(
                    <div className={`messageContainer ${chat.role==="user"?"userContainer":"assistantContainer"}`} key={idx}>
                        <div className={`messageWrapper ${chat.role==="user"?"userWrapper":"assistantWrapper"}`}>
                           
                            <div className={`messageBubble ${chat.role==="user"?"userBubble":"assistantBubble"}`}>
                                {chat.role==="user"?
                                    <p className="messageText">{chat.content}</p>:
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                                }
                            </div>
                            {chat.role==="user" && (
                                <div className="avatarBox userAvatarBox">
                                    <i className="fa-solid fa-user"></i>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            }
            {
                prevChats?.length>0 && (
                    <>
                    {
                        latestReply===null?(
                            <div className="messageContainer assistantContainer" key={"non-typing"}>
                                <div className="messageWrapper assistantWrapper">
                                    <div className="avatarBox assistantAvatar">
                                        <span>{provider === "OpenAI" ? "🤖" : "✨"}</span>
                                    </div>
                                    <div className="messageBubble assistantBubble">
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ):(
                            <div className="messageContainer assistantContainer" key={"typing"}>
                                <div className="messageWrapper assistantWrapper">
                                    <div className="avatarBox assistantAvatar">
                                        <span>{provider === "OpenAI" ? "🤖" : "✨"}</span>
                                    </div>
                                    <div className="messageBubble assistantBubble typing">
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>

                        )
                    }
                    </>
                )
            }
        </div>


        </>
    )
}


export default Chat;
