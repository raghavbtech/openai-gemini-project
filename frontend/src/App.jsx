
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ChatGpt from "./ChatGpt.jsx";


function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route
        path="/"
        element={
          <ProtectedRoute>
            <ChatGpt/>
          </ProtectedRoute>
          }
          />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
