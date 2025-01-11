import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validateInputs = () => {
    if (!email || !password) {
      setError("All fields are required");
      return false;
    }
    // Add email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    // Add password validation if needed
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch("https://akramsheriff5.pythonanywhere.com//login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          password, 
          role: role || "admin" // If no role is selected, try admin login
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        // Check role from response instead of local state for admin
        if (data.role === "admin") {
          navigate("/AdminDashboard");
        } else if (role === "client") {
          navigate("/ClientDashboard");
        } else if (role === "service_provider") {
          navigate("/ServiceProviderDashboard");
        }
      } else {
        // If admin login failed and no role selected, show role required error
        if (!role && data.error === "Invalid role") {
          setError("Please select a role");
        } else {
          setError(data.error || "Failed to log in");
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="background-container">
      <div className="header-logo">Webworrk</div>
      <div className="content-wrapper">
        <div className="login-box">
          <h2>Welcoming You!</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ padding: "15px 10px", width: "100%" }}
              >
                <option value="">Choose Role</option>
                <option value="client">Client</option>
                <option value="service_provider">Service Provider</option>
              </select>
            </div>
            <div className="input-box">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: "15px 10px" }}
              />
              <label>Email</label>
            </div>
            <div className="input-box">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ padding: "15px 10px" }}
              />
              <label>Password</label>
            </div>
            {error && (
              <div
                style={{
                  color: "red",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
              >
                {error}
              </div>
            )}
            <div className="options">
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>
            <button 
              type="submit" 
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <div className="register-link">
              Don't have an account?{" "}
              <Link to="/signup" className="register-text">
                Register Now
              </Link>
            </div>
          </form>
        </div>
        <div className="image-container">
          <img
            src="https://cdn.prod.website-files.com/65c1c617b0a6cc111ce93947/65c445ecdab5c40e29f53eca_Untitled%20design%20(15).png"
            alt="Login Illustration"
            style={{ width: "400px", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;