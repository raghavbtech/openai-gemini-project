
import { useState } from "react"
import { loginUser } from "./api/auth"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import "./Login.css"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const data = await loginUser(email, password)
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      setLoading(false)
      navigate("/")
    } catch (error) {
      setError(error)
      setLoading(false)
    }
  }

  return (
    <div className="loginContainer">
      <div className="loginCard">
        <h2 className="loginTitle">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="loginForm">
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

        <Link to="/register" className="authLink">Don't have an account? Sign up</Link>
          <button type="submit" className="submitButton" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <div className="errorMessage">{error}</div>}
      </div>
    </div>
  )
}

export default Login
