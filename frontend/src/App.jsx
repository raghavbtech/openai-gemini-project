
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Register from "./Register";
import Login from "./Login";
import ChatGpt from "./ChatGpt.jsx";


function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<ChatGpt/>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
