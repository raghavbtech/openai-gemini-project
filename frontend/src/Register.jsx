"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { registerUser } from "./api/auth"
import { useNavigate } from "react-router-dom"
import "./Register.css"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await registerUser(name, email, password)
      setLoading(false)
      navigate("/login")
    } catch (err) {
      setLoading(false)
      setError(err)
    }
  }

  return (
    <div className="registerContainer">
      <div className="registerCard">
        <h2 className="registerTitle">Create Account</h2>

        <form onSubmit={handleSubmit} className="registerForm">
          <div className="formGroup">
            <label className="formLabel">Name</label>
            <input
              type="text"
              className="formInput"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="formGroup">
            <label className="formLabel">Email</label>
            <input
              type="email"
              className="formInput"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="formGroup">
            <label className="formLabel">Password</label>
            <input
              type="password"
              className="formInput"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Link to="/login" className="authLink">Already have an account? Sign in</Link>
          <button type="submit" className="submitButton" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        {error && <div className="errorMessage">{error}</div>}
      </div>
    </div>
  )
}

export default Register
